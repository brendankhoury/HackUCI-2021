import "./App.css";
import {
    Button,
    FormControl,
    FormLabel,
    Grid,
    makeStyles,
    MenuItem,
    Select,
    Paper,
    TextField,
    Typography,
} from "@material-ui/core";
import { Alert, AlertTitle } from '@material-ui/lab';
import React, { useState } from "react";

const living = [
    "Nursing home/residential care",
    "Home with more people than rooms",
    "Homeless shelter",
    "Prison/Jail",
    "Group home",
    "Rehab center",
    "None of these",
];
const occupation = [
    "Ambulatory health care",
    "Assisted living",
    "Developmental disability facility",
    "Fire protection services",
    "Home healthcare services",
    "Hospital worker",
    "Nursing/residential care",
    "Outpatient care",
    "Pharmacy/drug store",
    "Physician/health practitioner",
    "Police",
    "Community relief services",
    "Cosmetic/beauty supply store",
    "Day care",
    "Dentistry",
    "Food/drink production or store",
    "Gas station",
    "Health/personal care store",
    "Homeless shelter",
    "Medical/diagnostic lab",
    "Optical goods store",
    "Medicine production",
    "Postal service",
    "Prison/Jail",
    "School teaching",
    "Transportation",
    "Warehousing/storage",
    "Animal production/fishing",
    "Bars/Restaurants",
    "Clothing/accessories store",
    "Construction",
    "Credit intermediation",
    "Crop production",
    "Hardware",
    "Mining",
    "Oil/gas extraction",
    "Specialty trade contractors",
    "Transport equipment production",
    "Utilities",
    "Waste management",
    "None",
];
const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    root: {
        backgroundImage: "url(/background.jpg)",
        backgroundSize: "cover",
    },
}));

function App() {
    const classes = useStyles();
    let [location, setLocation] = useState();
    let [userOccupation, setUserOccupation] = useState();
    let [livingSituation, setLivingSituation] = useState();
    let [age, setAge] = useState();
    let [response, setResponse] = useState("");
    // setResponse("");
    var submitForm = async () => {
        console.log(location, userOccupation, livingSituation, age);
        console.log()
        var data = await fetch("https://windy-star-303423.uc.r.appspot.com/", {
          method:"PUT",
          headers: { 
            'Content-type': 'application/json'
          }, 
          body: JSON.stringify({age:age, state:location, work: userOccupation, livingSituation:livingSituation, numConditions:0})
        })
        setResponse((await data.json()).message)
    };

    return (
        <Grid container className={classes.root}>
            <Grid item xs={3}></Grid>
            <Grid item xs={6} alignContent="center">
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    // alignItems="center"
                    justify="center"
                    style={{ minHeight: "100vh" }}
                >
                    <Paper
                        style={{
                            backgroundColor: "rgba(255, 255, 255, 0.85)",
                            padding: "12px",
                        }}
                    >
                        <Grid container>
                            {response === "" ? (
                                <div></div>
                            ) : (
                                <Alert severity="success" style={{marginBottom:"5px"}}>
                                    <AlertTitle>Info</AlertTitle>
                                    {response}
                                </Alert>
                            )}
                            <Grid
                                item
                                xs={12}
                                alignContent="center"
                                alignItems="center"
                            >
                                <Typography
                                    variant="h2"
                                    style={{ align: "center" }}
                                >
                                    Vaccine Estimator Tool
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <div>
                                    <FormControl class={classes.formControl}>
                                        <FormLabel id="state-select-label">
                                            Slect the state you live in{" "}
                                        </FormLabel>
                                        <Select
                                            onChange={(event) => {
                                                setLocation(event.target.value);
                                            }}
                                            value={location}
                                            fullWidth
                                            labelId="state-select-label"
                                        >
                                            <MenuItem value="Alabama">
                                                Alabama
                                            </MenuItem>
                                            <MenuItem value="Alaska">
                                                Alaska
                                            </MenuItem>
                                            <MenuItem value="Arizona">
                                                Arizona
                                            </MenuItem>
                                            <MenuItem value="Arkansas">
                                                Arkansas
                                            </MenuItem>
                                            <MenuItem value="California">
                                                California
                                            </MenuItem>
                                            <MenuItem value="Colorado">
                                                Colorado
                                            </MenuItem>
                                            <MenuItem value="Connecticut">
                                                Connecticut
                                            </MenuItem>
                                            <MenuItem value="Delaware">
                                                Delaware
                                            </MenuItem>
                                            <MenuItem value="Florida">
                                                Florida
                                            </MenuItem>
                                            <MenuItem value="Georgia">
                                                Georgia
                                            </MenuItem>
                                            <MenuItem value="Hawaii">
                                                Hawaii
                                            </MenuItem>
                                            <MenuItem value="Idaho">
                                                Idaho
                                            </MenuItem>
                                            <MenuItem value="Illinois Indiana">
                                                Illinois Indiana
                                            </MenuItem>
                                            <MenuItem value="Iowa">
                                                Iowa
                                            </MenuItem>
                                            <MenuItem value="Kansas">
                                                Kansas
                                            </MenuItem>
                                            <MenuItem value="Kentucky">
                                                Kentucky
                                            </MenuItem>
                                            <MenuItem value="Louisiana">
                                                Louisiana
                                            </MenuItem>
                                            <MenuItem value="Maine">
                                                Maine
                                            </MenuItem>
                                            <MenuItem value="Maryland">
                                                Maryland
                                            </MenuItem>
                                            <MenuItem value="Massachusetts">
                                                Massachusetts
                                            </MenuItem>
                                            <MenuItem value="Michigan">
                                                Michigan
                                            </MenuItem>
                                            <MenuItem value="Minnesota">
                                                Minnesota
                                            </MenuItem>
                                            <MenuItem value="Mississippi">
                                                Mississippi
                                            </MenuItem>
                                            <MenuItem value="Missouri">
                                                Missouri
                                            </MenuItem>
                                            <MenuItem value="Montana Nebraska">
                                                Montana Nebraska
                                            </MenuItem>
                                            <MenuItem value="Nevada">
                                                Nevada
                                            </MenuItem>
                                            <MenuItem value="New Hampshire">
                                                New Hampshire
                                            </MenuItem>
                                            <MenuItem value="New Jersey">
                                                New Jersey
                                            </MenuItem>
                                            <MenuItem value="New Mexico">
                                                New Mexico
                                            </MenuItem>
                                            <MenuItem value="New York">
                                                New York
                                            </MenuItem>
                                            <MenuItem value="North Carolina">
                                                North Carolina
                                            </MenuItem>
                                            <MenuItem value="North Dakota">
                                                North Dakota
                                            </MenuItem>
                                            <MenuItem value="Ohio">
                                                Ohio
                                            </MenuItem>
                                            <MenuItem value="Oklahoma">
                                                Oklahoma
                                            </MenuItem>
                                            <MenuItem value="Oregon">
                                                Oregon
                                            </MenuItem>
                                            <MenuItem value="Pennsylvania Rhode Island">
                                                Pennsylvania Rhode Island
                                            </MenuItem>
                                            <MenuItem value="South Carolina">
                                                South Carolina
                                            </MenuItem>
                                            <MenuItem value="South Dakota">
                                                South Dakota
                                            </MenuItem>
                                            <MenuItem value="Tennessee">
                                                Tennessee
                                            </MenuItem>
                                            <MenuItem value="Texas">
                                                Texas
                                            </MenuItem>
                                            <MenuItem value="Utah">
                                                Utah
                                            </MenuItem>
                                            <MenuItem value="Vermont">
                                                Vermont
                                            </MenuItem>
                                            <MenuItem value="Virginia">
                                                Virginia
                                            </MenuItem>
                                            <MenuItem value="Washington">
                                                Washington
                                            </MenuItem>
                                            <MenuItem value="West Virginia">
                                                West Virginia
                                            </MenuItem>
                                            <MenuItem value="Wisconsin">
                                                Wisconsin
                                            </MenuItem>
                                            <MenuItem value="Wyomin">
                                                Wyomin
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <div>
                                    <FormControl class={classes.formControl}>
                                        <FormLabel id="occupation-select-label">
                                            Select your occupation
                                        </FormLabel>
                                        <Select
                                            onChange={(event) => {
                                                setUserOccupation(
                                                    event.target.value
                                                );
                                            }}
                                            value={userOccupation}
                                            fullWidth
                                            labelId="occupation-select-label"
                                        >
                                            {occupation.map((work) => {
                                                return (
                                                    <MenuItem value={work}>
                                                        {work}
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    </FormControl>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <div>
                                    <FormControl class={classes.formControl}>
                                        <FormLabel id="occupation-select-label">
                                            Select your living situation
                                        </FormLabel>
                                        <Select
                                            onChange={(event) => {
                                                setLivingSituation(
                                                    event.target.value
                                                );
                                            }}
                                            value={livingSituation}
                                            fullWidth
                                            labelId="occupation-select-label"
                                        >
                                            {living.map((work) => {
                                                return (
                                                    <MenuItem value={work}>
                                                        {work}
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    </FormControl>
                                </div>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl class={classes.formControl}>
                                    <FormLabel id="age-label">
                                        What is your age
                                    </FormLabel>
                                    <TextField
                                        onChange={(event) => {
                                            setAge(event.target.value);
                                        }}
                                        value={age}
                                        fullWidth
                                        type="number"
                                        labelId="occupation-select-label"
                                    ></TextField>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={submitForm}
                                >
                                    When will I get the vaccine?
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
            <Grid item xs={3}></Grid>
        </Grid>
    );
}

export default App;
