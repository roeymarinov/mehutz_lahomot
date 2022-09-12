import "../utils/styles.css";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from "@mui/material";
import { useState } from "react";
import SubmitDialog from "./SubmitDialog";
import { useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import * as yup from "yup";
import { useFormik } from "formik";

function BusRegister() {
  const validationSchema = yup.object({
    email: yup
      .string()
      .email("הכניסו כתובת מייל תקינה")
      .required("אנא הכניסו כתובת מייל"),
    name: yup
      .string()
      .min(4, "אנא הכניסו שם מלא")
      .required("אנא הכניסו שם מלא"),
    phone: yup
      .string()
      .min(4, "אנא הכניסו מס' טלפון תקין")
      .max(20, "אנא הכניסו מס' טלפון תקין")
      .required("אנא הכניס טלפון נייד"),
    numPassengers: yup.string().required("אנא בחרו מס' נוסעים"),
  });
  const formik = useFormik({
    initialValues: {
      email: "",
      name: "",
      phone: "",
      numPassengers: "",
      boardingStation: "רכבת מרכז",
      alightingStation: "רכבת מרכז",
    },
    validationSchema: validationSchema,
    onSubmit: () => {
      setSubmitDialogOpen(true);
    },
  });

  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const { state } = useLocation();
  const { busTime, gameTime, gameDate, opponentName } = state; // Read values passed on state
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
  if (formik.values.numPassengers === "") {
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
      <form
        className="BusForm"
        dir="rtl"
        lang="he"
        onSubmit={formik.handleSubmit}
      >
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">
            תחנת עלייה (בהלוך)
          </FormLabel>
          <RadioGroup
            id={"boardingStation"}
            name={"boardingStation"}
            aria-labelledby="demo-radio-buttons-group-label"
            className="ChooseStation"
            value={formik.values.boardingStation}
            onChange={formik.handleChange}
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
            id={"alightingStation"}
            name={"alightingStation"}
            aria-labelledby="alighting-station-radio-buttons-group"
            className="ChooseStation"
            value={formik.values.alightingStation}
            onChange={formik.handleChange}
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
          <div className="NumPassengers">
            <Select
              id="numPassengers"
              name={"numPassengers"}
              value={formik.values.numPassengers}
              label=""
              displayEmpty
              error={
                formik.touched.numPassengers &&
                Boolean(formik.errors.numPassengers)
              }
              onChange={formik.handleChange}
            >
              <MenuItem value={""}>מס' נוסעים</MenuItem>
              {numPassengersArray.map((val) => {
                return (
                  <MenuItem value={val} key={val}>
                    {val}
                  </MenuItem>
                );
              })}
            </Select>
            {formik.touched.numPassengers &&
              Boolean(formik.errors.numPassengers) && (
                <FormHelperText error={true}>
                  {formik.touched.numPassengers && formik.errors.numPassengers}
                </FormHelperText>
              )}
          </div>
          <TextField
            id="name"
            name="name"
            placeholder="שם מלא"
            margin="dense"
            autoComplete="off"
            value={formik.values.name}
            error={formik.touched.name && Boolean(formik.errors.name)}
            onChange={formik.handleChange}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField
            id="email"
            name="email"
            placeholder="מייל"
            margin="dense"
            autoComplete="off"
            value={formik.values.email}
            error={formik.touched.email && Boolean(formik.errors.email)}
            onChange={formik.handleChange}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            id="phone"
            name="phone"
            placeholder="טלפון נייד"
            margin="dense"
            autoComplete="off"
            value={formik.values.phone}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            onChange={formik.handleChange}
            helperText={formik.touched.phone && formik.errors.phone}
          />
        </FormControl>

        <button className="SubmitButton" type={"submit"}>
          המשך
        </button>
      </form>
      <SubmitDialog
        setSubmitDialogOpen={setSubmitDialogOpen}
        submitDialogOpen={submitDialogOpen}
        personalDetails={{
          name: formik.values.name,
          alightingStation: formik.values.alightingStation,
          boardingStation: formik.values.boardingStation,
          numPassengers: formik.values.numPassengers,
          email: formik.values.email,
          phone: formik.values.phone,
        }}
        busDetails={state}
      />
    </div>
  );
}

export default BusRegister;
