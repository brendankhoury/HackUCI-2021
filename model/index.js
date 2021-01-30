const living = require("./data/livingSituation.js");
const occupation = require("./data/workerclass.js");
const state_phases = require("./data/state_phases.js")

const express = require("express");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");

const app = express();

const port = process.env.PORT || 5000;

var pfizer_data = {};
var moderna_data = {};

var cumulative_vaccine_data = {};
getCurrentWeek = () => {
    var d = new Date();
    // set the date to the date of the next monday
    d.setDate(d.getDate() + ((1 + 7 - d.getDay()) % 7));

    return (
        (d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth()) +
        "_" +
        (d.getDate() < 10 ? "0" + d.getDate() : d.getDate())
    );
};
getPreviousWeek = () => {
    var d = new Date();
    // set the date to the date of the previous monday

    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    // if (d.getDate() > prevDay) {
    //     d.setMonth(d.getMonth() - 1);
    //     // Hopefully covid will be gone by the time the year would make a dif
    // }

    // Adding 1 to the month is necessary, month starts at 0
    return (
        (d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth()) +
        "_" +
        (d.getDate() < 10 ? "0" + d.getDate() : d.getDate())
    );
};

vaccineDataPreprocessing = (data, dataType) => {
    data.forEach((jurisdictionData) => {
        // console.log(Object.keys(jurisdictionData))
        var jurisdiction =  ""
        // Replace was being annoying
        for (var i = 0; i < jurisdictionData.jurisdiction.length; i++){ 
            if (jurisdictionData.jurisdiction.charAt(i) !== "*" && jurisdictionData.jurisdiction.charAt(i) !== "~" ) {
                jurisdiction += jurisdictionData.jurisdiction.charAt(i)
            }
        }
        jurisdiction = jurisdiction.trim().toLocaleLowerCase()

        if (cumulative_vaccine_data[jurisdiction] === undefined) {
            currentWeekIndex =
                "doses_allocated_for_week_of_" + getCurrentWeek();
            previousWeekIndex =
                "doses_allocated_week_of_" + getPreviousWeek();
            // console.log(jurisdictionData[previousWeekIndex])
            // console.log(jurisdictionData[currentWeekIndex], jurisdictionData[currentWeekIndex] !== undefined, previousWeekIndex,jurisdictionData[previousWeekIndex] !== undefined)
            if (jurisdictionData[currentWeekIndex] !== undefined && jurisdictionData[previousWeekIndex] !== undefined && jurisdictionData["total_" + dataType + "_allocation_first_dose_shipments"] !== undefined) {
                cumulative_vaccine_data[jurisdiction] = {
                    twoWeekAdmin:
                        Number(
                            jurisdictionData[currentWeekIndex].replace(/\,/g, "")
                        ) +
                        Number(
                            jurisdictionData[previousWeekIndex].replace(/\,/g, "")
                        ),
                    currentTotal:
                            Number(jurisdictionData["total_" + dataType + "_allocation_first_dose_shipments"].replace(/\,/g, ""))
                };
                // console.log(jurisdiction, cumulative_vaccine_data[jurisdiction])
            }
        } else {
            currentWeekIndex =
                "doses_allocated_for_week_of_" + getCurrentWeek();
            previousWeekIndex =
                "doses_allocated_week_of_" + getPreviousWeek();
            cumulative_vaccine_data[jurisdiction].twoWeekAdmin +=
                Number(jurisdictionData[currentWeekIndex].replace(/\,/g, "")) +
                Number(jurisdictionData[previousWeekIndex].replace(/\,/g, ""));
            cumulative_vaccine_data[jurisdiction].currentTotal += Number(jurisdictionData["total_" + dataType + "_allocation_first_dose_shipments"].replace(/\,/g, ""))
            // console.log(jurisdictionData["total_" + dataType + "_allocation_first_dose_shipments"])
            // console.log(
            //     Number(jurisdictionData[currentWeekIndex].replace(",", ""))
            // );
            // console.log(cumulative_vaccine_data[jurisdiction].twoWeekAdmin)
        }
    });
    // console.log(data)
};

fetch("https://data.cdc.gov/resource/saz5-9hgg.json")
    .then((res) => res.json())
    .then((json) => {
        pfizer_data = json;
        vaccineDataPreprocessing(pfizer_data,'pfizer');
    });
fetch("https://data.cdc.gov/resource/b7pe-5nws.json")
    .then((res) => res.json())
    .then((json) => {
        moderna_data = json;
        vaccineDataPreprocessing(moderna_data, 'moderna');
    });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

phaseIdentifier = (age, work, livingSituation) => {
    curPhase = 10;
    if (age >= 3 && age <= 30) {
        curPhase = 3;
    } else if (age <= 64) {
        curPhase = 4;
    } else {
        curPhase = 2;
    }
    if (
        living[livingSituation] !== null &&
        living[livingSituation] < curPhase
    ) {
        curPhase = living[livingSituation];
    }
    if (occupation[work] !== null && occupation[work] < curPhase) {
        curPhase = occupation[work];
    }
    if (curPhase === 1.5) {
        curPhase = "1b";
    } else if (curPhase === 1) {
        curPhase = "1a";
    } else {
        curPhase = curPhase + "";
    }
    return curPhase;
};

app.get("/", (req, res) => {
    let age = req.body.age;
    let work = req.body.work;
    let livingSituation = req.body.livingSituationl;
    let state = req.body.state.toLocaleLowerCase().trim()

    const phase = phaseIdentifier(age, work, livingSituation);

    // Calculate # of people ahead to get the vaccine
    // Joey
    var pplAhead = 0;
    
    console.log(Object.keys(state_phases))

    if (phase === "1a") {
        pplAhead = 0
    } else if (phase === "1b") {
        pplAhead = state_phases.state_phases[state]["1a"]
    } else if (phase === "2") {
        pplAhead = state_phases.state_phases[state]["1a"] +  state_phases.state_phases[state]["1b"]
    } else if (phase === "3") {
        pplAhead = state_phases.state_phases[state]["1a"] +  state_phases.state_phases[state]["1b"] + state_phases.state_phases[state]["2"]
    } else if (phase === "4") {
        pplAhead = state_phases.state_phases[state]["1a"] +  state_phases.state_phases[state]["1b"] + state_phases.state_phases[state]["2"] + state_phases.state_phases[state]["3"]
    }
    // Calculate the # of vaccines administered per day
    console.log(cumulative_vaccine_data[state], state_phases.state_phases[state])
    const dailyVaccines = cumulative_vaccine_data[state].twoWeekAdmin / 14
    
    // From there identify the number of days to get ahead.
    const daysUntilPhaseAvailibility = (pplAhead - cumulative_vaccine_data[state].currentTotal) / dailyVaccines;
    let message = "We estimate you are in phase " + phase + "\n";  
    if (daysUntilPhaseAvailibility <= 0) {
        message = "Currently, your state is probably distributing vaccines to people in your phase, contact your local government for more information."
    } else {
        message = "We estimate that it will take " + daysUntilPhaseAvailibility + " more days until your phase begins getting the vaccine. It will likely take longer to reach everyone in your phase."
    }
    
    console.log("phase", phase);
    res.json({
        phase: phase,
        getCurrentWeek: getCurrentWeek(),
        message: message,
    });
});

app.listen(port, () => {
    /* eslint-disable no-console */
    console.log(`Listening: http://localhost:${port}`);
    /* eslint-enable no-console */
});
