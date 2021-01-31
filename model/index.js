const living = require("./data/livingSituation.js");
const occupation = require("./data/workerclass.js");
const state_phases = require("./data/state_phases.js");

const express = require("express");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
const parse = require("csv-parse/lib/sync");
const e = require("express");
const app = express();

const port = process.env.PORT || 8080;

// This looks like:
// key: date
// Value: {}
//  ----- key: state
/// ----- value: everything else.
var cumulative_vaccine_data = {};

preprocess_vaccine_data = (data) => {
    data.forEach((item) => {
        if (cumulative_vaccine_data[item.date] === undefined) {
            cumulative_vaccine_data[item.date] = {};
        }
        const itemDate = item.date;
        const itemLocation = item.location.toLocaleLowerCase();
        delete item.date;
        delete item.location;
        cumulative_vaccine_data[itemDate][itemLocation] = item;
    });
    console.log("Data done processing");
};

fetch(
    "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/us_state_vaccinations.csv"
)
    .then((res) => res.text())
    .then((text) => {
        preprocess_vaccine_data(
            parse(text, {
                columns: true,
                skip_empty_lines: true,
            })
        );
    });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

phaseIdentifier = (age, work, livingSituation, numConditions) => {
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

    if (numConditions > 1) {
        if (curPhase > 1.5) {
            curPhase = 1.5;
        }
    } else if (numConditions == 1) {
        curPhase = 2;
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
    let numConditions = req.body.numConditions;
    let state = req.body.state.toLocaleLowerCase().trim();

    const phase = phaseIdentifier(age, work, livingSituation, numConditions);

    // Calculate # of people ahead to get the vaccine
    // Joey
    var pplAhead = 0;

    if (phase === "1a") {
        pplAhead = 0;
    } else if (phase === "1b") {
        pplAhead = state_phases.state_phases[state]["1a"];
    } else if (phase === "2") {
        pplAhead =
            state_phases.state_phases[state]["1a"] +
            state_phases.state_phases[state]["1b"];
    } else if (phase === "3") {
        pplAhead =
            state_phases.state_phases[state]["1a"] +
            state_phases.state_phases[state]["1b"] +
            state_phases.state_phases[state]["2"];
    } else if (phase === "4") {
        pplAhead =
            state_phases.state_phases[state]["1a"] +
            state_phases.state_phases[state]["1b"] +
            state_phases.state_phases[state]["2"] +
            state_phases.state_phases[state]["3"];
    }
    // Calculate the # of vaccines administered per day
    // console.log(
    //     cumulative_vaccine_data[state],
    //     state_phases.state_phases[state]
    // );
    const today = new Date();
    // console.log(today.toISOString().substr(0,10))
    let dailyVaccines = 0;
    var numDaysAveraged = 0;
    // cumulative_vaccine_data[today.toISOString().substr(0,10)][state]["daily_vaccinations"]

    for (var i = 0; i < 4; i++) {
        if (
            cumulative_vaccine_data[today.toISOString().substr(0, 10)] !==
            undefined
        ) {
            dailyVaccines += Number(
                cumulative_vaccine_data[today.toISOString().substr(0, 10)][
                    state
                ]["daily_vaccinations"]
            );
            numDaysAveraged += 1;
        }
        today.setDate(today.getDate() - 1);
    }
    dailyVaccines = dailyVaccines / numDaysAveraged;

    // From there identify the number of days to get ahead.
    const daysUntilPhaseAvailibility =
        (pplAhead -
            cumulative_vaccine_data[today.toISOString().substr(0, 10)][state]
                .people_vaccinated) /
        dailyVaccines;
    let message = "We estimate you are in phase " + phase + "\n";
    if (daysUntilPhaseAvailibility <= 0) {
        message =
            "Currently, your state is probably distributing vaccines to people in your phase, contact your local government for more information.";
    } else {
        message =
            "We estimate that it will take " +
            Math.trunc(daysUntilPhaseAvailibility) +
            " more days until your phase begins getting the vaccine. It will likely take longer to reach everyone in your phase. This assumes that vaccine distribution maintains its current rate, it may increase in the future.";
    }

    res.json({
        phase: phase,
        // getCurrentWeek: getCurrentWeek(),
        message: message,
    });
});

app.listen(port, () => {
    /* eslint-disable no-console */
    console.log(`Listening: http://localhost:${port}`);
    /* eslint-enable no-console */
});
