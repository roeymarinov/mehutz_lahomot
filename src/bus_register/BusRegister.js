import "../utils/styles.css";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useState } from "react";
import SubmitDialog from "./SubmitDialog";
import { useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

function BusRegister() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [numPassengers, setNumPassengers] = useState("");
  const [boardingStation, setBoardingStation] = useState("רכבת מרכז");
  const [alightingStation, setAlightingStation] = useState("רכבת מרכז");

  const [phoneError, setPhoneError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const { state } = useLocation();
  const { busTime, gameTime, gameDate, opponentName, busID } = state; // Read values passed on state
  const [availablePlaces, setAvailablePlaces] = useState(0);
  const [numPassengersArray, setNumPassengersArray] = useState([0]);

  const checkAvailablePlaces = async () => {
    const busRef = doc(db, "Buses", state.busID);
    const docSnap = await getDoc(busRef);
    if (docSnap.exists()) {
      const maxPassengers = docSnap.data().max_passengers;
      const totalPassengers = docSnap.data().total_passengers;
      if (totalPassengers < maxPassengers) {
        setAvailablePlaces(maxPassengers - totalPassengers);
      }
    }
  };
  if (numPassengers === "") {
    checkAvailablePlaces().then(() => {
      setNumPassengersArray(
        [...Array(Math.min(availablePlaces, 10) + 1).keys()].slice(1)
      );
    });
  }

  return (
    <div className="BusRegister">
      <div className="FormTitle">
        <p>הרשמה להסעה</p>
        <p>
          {opponentName} -{" " + gameDate}
        </p>
      </div>
      <div className="InfoCard">
        <div>
          <p>שעת המשחק: {gameTime}</p>
          <p>יציאה מרכבת מרכז: {busTime}</p>
          <p>₪20/₪15 לכיוון</p>
        </div>
      </div>
      <div className="BusForm" dir="rtl" lang="he">
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">
            תחנת עלייה (בהלוך)
          </FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="רכבת מרכז"
            className="ChooseStation"
            onChange={(event) => {
              setBoardingStation(event.target.value);
            }}
          >
            <FormControlLabel
              value="רכבת מרכז"
              control={<Radio />}
              label="רכבת מרכז (₪20)"
            />
            <FormControlLabel
              value="חניון שפירים"
              control={<Radio />}
              label="חניון שפירים - הנתיב המהיר (₪20)"
            />
            <FormControlLabel
              value="צומת שילת"
              control={<Radio />}
              label="צומת שילת (₪15)"
            />
            <FormControlLabel
              value="אני נוסע/ת רק חזור"
              control={<Radio />}
              label="אני נוסע/ת רק חזור"
            />
          </RadioGroup>
          <FormLabel id="alighting-station-radio-buttons-group">
            תחנת ירידה (בחזור)
          </FormLabel>
          <RadioGroup
            aria-labelledby="alighting-station-radio-buttons-group"
            defaultValue="רכבת מרכז"
            className="ChooseStation"
            onChange={(event) => {
              setAlightingStation(event.target.value);
            }}
          >
            <FormControlLabel
              value="רכבת מרכז"
              control={<Radio />}
              label="רכבת מרכז (₪20)"
            />
            <FormControlLabel
              value="חניון שפירים"
              control={<Radio />}
              label="חניון שפירים - הנתיב המהיר (₪20)"
            />
            <FormControlLabel
              value="צומת שילת"
              control={<Radio />}
              label="צומת שילת (₪15)"
            />
            <FormControlLabel
              value="אני נוסע/ת רק הלוך"
              control={<Radio />}
              label="אני נוסע/ת רק הלוך"
            />
          </RadioGroup>

          <Select
            className="NumPassengers"
            value={numPassengers}
            label=""
            displayEmpty
            onChange={(event) => {
              setNumPassengers(event.target.value);
            }}
          >
            <MenuItem value="">מס' נוסעים</MenuItem>
            {numPassengersArray.map((val) => {
              return (
                <MenuItem value={val} key={val}>
                  {val}
                </MenuItem>
              );
            })}
          </Select>
          <TextField
            placeholder="שם מלא"
            margin="dense"
            required={true}
            autoComplete="off"
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
          <TextField
            placeholder="מייל"
            margin="dense"
            required={true}
            autoComplete="off"
            error={emailError}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
          <TextField
            placeholder="טלפון נייד"
            margin="dense"
            required={true}
            autoComplete="off"
            error={phoneError}
            onChange={(event) => {
              setPhone(event.target.value);
            }}
          />
        </FormControl>
      </div>

      <button
        className="SubmitButton"
        onClick={() => setSubmitDialogOpen(true)}
      >
        המשך
      </button>
      <SubmitDialog
        setSubmitDialogOpen={setSubmitDialogOpen}
        submitDialogOpen={submitDialogOpen}
        personalDetails={{
          name: name,
          alightingStation: alightingStation,
          boardingStation: boardingStation,
          numPassengers: numPassengers,
          email: email,
          phone: phone,
        }}
        busDetails={state}
      />
    </div>
  );
}

export default BusRegister;
