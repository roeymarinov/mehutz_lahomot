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
  CircularProgress,
  Checkbox,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import SubmitDialog from "./SubmitDialog";
import { useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import * as yup from "yup";
import { useFormik, yupToFormErrors } from "formik";
import { AuthenticatedUserContext } from "../utils/UserProvider";
import googleMaps from "../assets/google_maps.png";
import waze from "../assets/waze.png";
const LATRUN_PRICE = 15;
const PRICE = 20;

function BusRegister() {
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const { state } = useLocation();
  const { user } = useContext(AuthenticatedUserContext);
  const { busTime, gameTime, gameDate, opponentName } = state; // Read values passed on state
  const [numPassengersArray, setNumPassengersArray] = useState([0]);
  const [numMembers, setNumMembers] = useState(0);
  const [price, setPrice] = useState(0);

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
      .matches(/^\d+$/, "אנא הכניסו ספרות בלבד")
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
      sendMail: true,
    },
    validate: async (values) => {
      const errors = {};
      if (
        values.boardingStation === "אני נוסע/ת רק חזור" &&
        values.alightingStation === "אני נוסע/ת רק הלוך"
      ) {
        errors.alightingStation =
          "אם אתם לא נוסעים באף אחד מהכיוונים, למה להירשם? (;";
      }
      try {
        await validationSchema.validate(values, { abortEarly: false });
      } catch (e) {
        return {
          ...yupToFormErrors(e),
          ...errors,
        };
      }
      return errors;
    },
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      const isEmailOk = await checkEmail(values.email);
      if (isEmailOk) {
        setSubmitDialogOpen(true);
      } else {
        setErrors({ email: "כתובת המייל הזו כבר רשומה להסעה" });
      }
      setSubmitting(false);
    },
  });

  const checkEmail = async (email) => {
    const busRef = doc(db, "Buses", state.busID);
    const docSnap = await getDoc(busRef);
    if (docSnap.exists()) {
      const registeredUsers = docSnap.data().registered_users;
      return registeredUsers[email.replaceAll(".", "@")] === undefined;
    }
  };

  const calculatePrice = (
    numPassengers,
    numMembers,
    boardingStation,
    alightingStation
  ) => {
    const numPaying = Math.max(numPassengers - numMembers, 0);
    const toGamePrice =
      boardingStation === "מחלף לטרון"
        ? LATRUN_PRICE
        : boardingStation === "אני נוסע/ת רק חזור"
        ? 0
        : PRICE;
    const fromGamePrice =
      alightingStation === "מחלף לטרון"
        ? LATRUN_PRICE
        : alightingStation === "אני נוסע/ת רק הלוך"
        ? 0
        : PRICE;
    setPrice(numPaying * (toGamePrice + fromGamePrice));
  };

  const getNumMembers = async (email) => {
    const memberRef = doc(db, "Members", email);
    const docSnap = await getDoc(memberRef);
    if (docSnap.exists()) {
      return docSnap.data().numMembers;
    } else return 0;
  };

  const checkAvailablePlaces = async () => {
    const busRef = doc(db, "Buses", state.busID);
    const docSnap = await getDoc(busRef);
    if (docSnap.exists()) {
      const maxPassengers = docSnap.data().max_passengers;
      const totalPassengersToGame = docSnap.data().totals.toGame;
      const totalPassengersFromGame = docSnap.data().totals.fromGame;

      const availablePlacesToGame = Math.max(
        0,
        maxPassengers - totalPassengersToGame
      );
      const availablePlacesFromGame = Math.max(
        0,
        maxPassengers - totalPassengersFromGame
      );

      return (
        Math.min(Math.max(availablePlacesFromGame, availablePlacesToGame), 10) +
        1
      );
    }
  };

  useEffect(() => {
    if (user) {
      getNumMembers(user.email).then((num) => {
        if (numMembers !== num) {
          setNumMembers(num);
        }
      });
    }
    if (formik.values.numPassengers === "") {
      checkAvailablePlaces().then((arrayLen) => {
        setNumPassengersArray([...Array(arrayLen).keys()].slice(1));
      });
    }
  }, [numMembers, user]);

  useEffect(() => {
    calculatePrice(
      formik.values.numPassengers,
      numMembers,
      formik.values.boardingStation,
      formik.values.alightingStation
    );
  }, [
    numMembers,
    formik.values.numPassengers,
    formik.values.boardingStation,
    formik.values.alightingStation,
  ]);

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
          <div className={"InfoCardTitle"}>
            <h3>שעת המשחק: {gameTime}</h3>
            <h3>
              ₪{PRICE}/₪{LATRUN_PRICE} לכיוון
            </h3>
          </div>
          <div className={"StationInfo"}>
            <p>יציאה מרכבת מרכז: {busTime.merkaz}</p>

            <div className="NavigationLogoLinks">
              <a
                href={
                  "https://www.google.com/maps/place/32%C2%B004'57.3%22N+34%C2%B047'49.3%22E/@32.0825762,34.7948253,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0x5b1fe893dfd911a3!8m2!3d32.0825762!4d34.797014"
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={googleMaps} alt={""} className="NavigationLogo" />
              </a>
              <a
                href={
                  "https://www.waze.com/en/live-map/directions?latlng=32.082567287017234%2C34.79709362931317"
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={waze} alt={""} className="NavigationLogo" />
              </a>
            </div>
          </div>
          <div className={"StationInfo"}>
            <p>חניון שפירים - הנתיב המהיר: {busTime.mahir} (משוער)</p>

            <div className="NavigationLogoLinks">
              <a
                href={"https://goo.gl/maps/uUs7XvzEDvEixndH7"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={googleMaps} alt={""} className="NavigationLogo" />
              </a>
              <a
                href={
                  "https://www.waze.com/en/live-map/directions/%D7%97%D7%A0%D7%99%D7%95%D7%9F-%D7%94%D7%A0%D7%AA%D7%99%D7%91-%D7%94%D7%9E%D7%94%D7%99%D7%A8?place=w.22806848.228330624.298229"
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={waze} alt={""} className="NavigationLogo" />
              </a>
            </div>
          </div>
          <div className={"StationInfo"}>
            <p>מחלף לטרון: {busTime.latrun} (משוער)</p>
            <div className="NavigationLogoLinks">
              <a
                href={"https://goo.gl/maps/1G33UvGpp2kkDHDW6"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={googleMaps} alt={""} className="NavigationLogo" />
              </a>
              <a
                href={
                  "https://www.waze.com/en/live-map/directions/%D7%9E%D7%97%D7%9C%D7%A3-%D7%9C%D7%98%D7%A8%D7%95%D7%9F?place=ChIJh1AfvQbPAhURGFSRRg7dSe0"
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={waze} alt={""} className="NavigationLogo" />
              </a>
            </div>
          </div>
          <div className={"StationInfo"}>
            <p>איסוף מחניון המשק: 10 דק' מתום המשחק</p>

            <div className="NavigationLogoLinks">
              <a
                href={"https://goo.gl/maps/SmQ2Lhx7aAcRqUmWA"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={googleMaps} alt={""} className="NavigationLogo" />
              </a>
              <a
                href={
                  "https://www.waze.com/en/live-map/directions/%D7%97%D7%A0%D7%99%D7%95%D7%9F-%D7%A4%D7%99%D7%A1-%D7%90%D7%A8%D7%A0%D7%94-%D7%99%D7%A8%D7%95%D7%A9%D7%9C%D7%99%D7%9D?place=w.23068990.230624359.64807"
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={waze} alt={""} className="NavigationLogo" />
              </a>
            </div>
          </div>
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
              label={`רכבת מרכז (₪${PRICE})`}
            />
            <FormControlLabel
              value="חניון שפירים"
              control={<Radio />}
              label={`חניון שפירים - הנתיב המהיר (₪${PRICE})`}
            />
            <FormControlLabel
              value="מחלף לטרון"
              control={<Radio />}
              label={`מחלף לטרון (₪${LATRUN_PRICE})`}
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
              label={`רכבת מרכז (₪${PRICE})`}
            />
            <FormControlLabel
              value="חניון שפירים"
              control={<Radio />}
              label={`חניון שפירים - הנתיב המהיר (₪${PRICE})`}
            />
            <FormControlLabel
              value="מחלף לטרון"
              control={<Radio />}
              label={`מחלף לטרון (₪${LATRUN_PRICE})`}
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
        {numMembers > 0 && (
          <div className={"NumMembers"}>
            <FormLabel>מס' מנויים: </FormLabel>
            <FormLabel>{numMembers}</FormLabel>
          </div>
        )}
        <div className={"NumMembers"}>
          <FormLabel>מחיר: </FormLabel>
          <FormLabel>₪{price}</FormLabel>
        </div>
        {formik.touched.alightingStation &&
          Boolean(formik.errors.alightingStation) && (
            <FormHelperText error={true}>
              {formik.touched.alightingStation &&
                formik.errors.alightingStation}
            </FormHelperText>
          )}
        <FormControlLabel
          control={
            <Checkbox
              defaultChecked
              id={"sendMail"}
              name={"sendMail"}
              value={formik.values.sendMail}
              onChange={formik.handleChange}
            />
          }
          label="שלחו לי מייל אישור עם פרטי ההסעה"
        />
        <button className="SubmitButton" type={"submit"}>
          {formik.isSubmitting ? (
            <CircularProgress size={"1em"} color={"info"} />
          ) : (
            "המשך"
          )}
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
          numMembers: Math.min(numMembers, formik.values.numPassengers),
          sendMail: formik.values.sendMail,
          sentMail: false,
          price: price,
        }}
        busDetails={state}
      />
    </div>
  );
}

export default BusRegister;
