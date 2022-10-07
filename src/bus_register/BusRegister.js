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
  Popover,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import SubmitDialog from "./SubmitDialog";
import { useLocation } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import * as yup from "yup";
import { useFormik, yupToFormErrors } from "formik";
import { AuthenticatedUserContext } from "../utils/UserProvider";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
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
  console.log(user);
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
      email: user ? user.email : "",
      name: user ? user.displayName : "",
      phone: "",
      numPassengers: "",
      boardingStation: "רכבת מרכז",
      alightingStation: "רכבת מרכז",
      sendMail: true,
      saveDetails: false,
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
        if (values.saveDetails) {
          await setPreferences(values.email);
        }
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

  async function setPreferences(email) {
    const userRef = doc(db, "Users", email);

    await updateDoc(userRef, {
      preferences: {
        name: formik.values.name,
        alightingStation: formik.values.alightingStation,
        boardingStation: formik.values.boardingStation,
        numPassengers: formik.values.numPassengers,
        email: formik.values.email,
        phone: formik.values.phone,
        sendMail: formik.values.sendMail,
      },
    });
  }

  async function getPreferences(email) {
    const userRef = doc(db, "Users", email);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data().preferences;
    }
    return null;
  }

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
  const [anchorSavePopover, setAnchorSavePopover] = useState(null);
  const [anchorPhonePopover, setAnchorPhonePopover] = useState(null);

  const handlePopoverOpen = (event, setAnchorElementPopover) => {
    setAnchorElementPopover(event.currentTarget);
  };

  const handlePopoverClose = (setAnchorElementPopover) => {
    setAnchorElementPopover(null);
  };

  const togglePopover = (
    event,
    anchorElementPopover,
    setAnchorElementPopover
  ) => {
    console.log("toggle");
    if (anchorElementPopover) {
      setAnchorElementPopover(null);
    } else {
      setAnchorElementPopover(event.currentTarget);
    }
  };

  const savePopoverOpen = Boolean(anchorSavePopover);
  const phonePopoverOpen = Boolean(anchorPhonePopover);

  useEffect(() => {
    if (user) {
      getNumMembers(user.email).then((num) => {
        if (numMembers !== num) {
          setNumMembers(num);
        }
      });
      getPreferences(user.email).then((preferences) => {
        formik.setValues({
          alightingStation:
            preferences.alightingStation !== undefined
              ? preferences.alightingStation
              : formik.values.alightingStation,
          boardingStation:
            preferences.boardingStation !== undefined
              ? preferences.boardingStation
              : formik.values.boardingStation,
          sendMail:
            preferences.sendMail !== undefined
              ? preferences.sendMail
              : formik.values.sendMail,
          phone:
            preferences.phone !== undefined
              ? preferences.phone
              : formik.values.phone,
          numPassengers:
            preferences.numPassengers !== undefined
              ? preferences.numPassengers
              : formik.values.numPassengers,
          saveDetails: formik.values.saveDetails,
          name:
            preferences.name !== undefined
              ? preferences.name
              : user.displayName,
          email: user.email,
        });
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
          <div className="InfoCardTitle">
            <div className={"NoUserText"}>
              <p style={{ margin: 0 }}>תשלום דרך&nbsp;</p>
              <a
                href={
                  "https://web.payboxapp.com/?v=j&g=61547de7df517a0008bdb060#/"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="RegisterText"
              >
                פייבוקס
              </a>
            </div>
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
                href={"https://waze.com/ul/hsv8wxb6kg7"}
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
                href={"https://maps.app.goo.gl/uH6yxTU5ZQRzWCj98"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={googleMaps} alt={""} className="NavigationLogo" />
              </a>
              <a
                href={"https://waze.com/ul/hsv8y0cshq"}
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
                href={"https://waze.com/ul/hsv8vhhh6z"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={waze} alt={""} className="NavigationLogo" />
              </a>
            </div>
          </div>
          <div className={"StationInfo"}>
            <p>איסוף מחניית השחקנים: 10 דק' מתום המשחק</p>

            <div className="NavigationLogoLinks">
              <a
                href={"https://goo.gl/maps/SmQ2Lhx7aAcRqUmWA"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={googleMaps} alt={""} className="NavigationLogo" />
              </a>
              <a
                href={"https://waze.com/ul/hsv9h8u504"}
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
          <FormLabel id="demo-radio-buttons-group-label">מס' נוסעים</FormLabel>
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
          <FormLabel id="demo-radio-buttons-group-label">שם מלא </FormLabel>
          <TextField
            id="name"
            name="name"
            // placeholder={user ? user.name : "שם מלא"}
            margin="dense"
            autoComplete="off"
            value={formik.values.name}
            error={formik.touched.name && Boolean(formik.errors.name)}
            onChange={formik.handleChange}
            helperText={formik.touched.name && formik.errors.name}
          />
          <FormLabel id="demo-radio-buttons-group-label">מייל </FormLabel>
          <TextField
            id="email"
            name="email"
            placeholder={user ? user.email : "מייל"}
            margin="dense"
            autoComplete="off"
            disabled={user ? user.email !== undefined : false}
            value={formik.values.email}
            error={formik.touched.email && Boolean(formik.errors.email)}
            onChange={formik.handleChange}
            helperText={formik.touched.email && formik.errors.email}
          />
          <FormLabel className={"PhoneLabel"}>
            טלפון נייד{" "}
            <Popover
              sx={{
                pointerEvents: "none",
              }}
              open={phonePopoverOpen}
              anchorEl={anchorPhonePopover}
              anchorOrigin={{
                vertical: "center",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "center",
                horizontal: "right",
              }}
              onClose={() => handlePopoverClose(setAnchorPhonePopover)}
              disableRestoreFocus
            >
              <Typography className={"PhoneInfoText"}>
                {" "}
                אנו נשתמש בטלפון זה רק
              </Typography>
              <Typography className={"PhoneInfoText"}>
                לצורך תיאום ההגעה להסעה
              </Typography>
            </Popover>
            <HelpOutlineIcon
              color={"inherit"}
              fontSize={"medium"}
              className={"PhoneInfoIcon"}
              onMouseEnter={(event) =>
                handlePopoverOpen(event, setAnchorPhonePopover)
              }
              onMouseLeave={() => handlePopoverClose(setAnchorPhonePopover)}
              onClick={(event) =>
                togglePopover(event, anchorPhonePopover, setAnchorPhonePopover)
              }
            />
          </FormLabel>
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
        <div className={"Checkbox"}>
          <FormControlLabel
            control={
              <Checkbox
                id={"saveDetails"}
                name={"saveDetails"}
                disabled={!user}
                value={formik.values.saveDetails}
                onChange={formik.handleChange}
              />
            }
            label="שמירת פרטים להסעות הבאות"
          />
          <Popover
            sx={{
              pointerEvents: "none",
            }}
            open={savePopoverOpen}
            anchorEl={anchorSavePopover}
            anchorOrigin={{
              vertical: "center",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "center",
              horizontal: "right",
            }}
            onClose={() => handlePopoverClose(setAnchorSavePopover)}
            disableRestoreFocus
          >
            <Typography className={"PhoneInfoText"}>
              {" "}
              שמירת כל פרטי הרישום (מס' נוסעים, תחנות, שם וכו') כך שלא תצטרכו
              להכניסם שוב בפעם הבאה.{" "}
            </Typography>
            <Typography className={"PhoneInfoText"}>
              ניתן לערוך את הפרטים בכל עת דרך ההגדרות.{" "}
            </Typography>
            <Typography className={"PhoneInfoText"}>
              אופציה זו ניתנת רק למשתמשים מחוברים.{" "}
            </Typography>
          </Popover>
          <HelpOutlineIcon
            color={"inherit"}
            fontSize={"medium"}
            className={"CheckboxInfoIcon"}
            onMouseEnter={(event) =>
              handlePopoverOpen(event, setAnchorSavePopover)
            }
            onMouseLeave={() => handlePopoverClose(setAnchorSavePopover)}
            onClick={(event) =>
              togglePopover(event, anchorSavePopover, setAnchorSavePopover)
            }
          />
        </div>
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
