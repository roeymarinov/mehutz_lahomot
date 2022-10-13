import "../utils/styles.css";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Popover,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import * as yup from "yup";
import { useFormik, yupToFormErrors } from "formik";
import { AuthenticatedUserContext } from "../utils/UserProvider";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Edit } from "@mui/icons-material";
const LATRUN_PRICE = 15;
const PRICE = 20;

function Settings() {
  const { user } = useContext(AuthenticatedUserContext);
  const numPassengersArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const [numMembers, setNumMembers] = useState(0);
  const [phoneDisabled, setPhoneDisabled] = useState(true);
  const [nameDisabled, setNameDisabled] = useState(true);
  const [usernameDisabled, setUsernameDisabled] = useState(true);

  const validationSchema = yup.object({
    name: yup
      .string()
      .min(4, "אנא הכניסו שם מלא")
      .required("אנא הכניסו שם מלא"),
    username: yup
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
      username: user ? user.displayName : "",
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
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(false);
    },
  });

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

  const getNumMembers = async (email) => {
    const memberRef = doc(db, "Members", email);
    const docSnap = await getDoc(memberRef);
    if (docSnap.exists()) {
      return docSnap.data().numMembers;
    } else return 0;
  };

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
    if (anchorElementPopover) {
      setAnchorElementPopover(null);
    } else {
      setAnchorElementPopover(event.currentTarget);
    }
  };

  const phonePopoverOpen = Boolean(anchorPhonePopover);

  useEffect(() => {
    if (user) {
      getNumMembers(user.email).then((num) => {
        if (numMembers !== num) {
          setNumMembers(num);
        }
      });
      getPreferences(user.email).then((details) => {
        if (details) {
          formik.setValues({
            alightingStation:
              details.alightingStation !== undefined
                ? details.alightingStation
                : formik.values.alightingStation,
            boardingStation:
              details.boardingStation !== undefined
                ? details.boardingStation
                : formik.values.boardingStation,
            sendMail:
              details.sendMail !== undefined
                ? details.sendMail
                : formik.values.sendMail,
            phone:
              details.phone !== undefined ? details.phone : formik.values.phone,
            numPassengers:
              details.numPassengers !== undefined
                ? details.numPassengers
                : formik.values.numPassengers,
            saveDetails: formik.values.saveDetails,
            name: details.name !== undefined ? details.name : user.displayName,
            email: user.email,
          });
        }
      });
    }
  }, [numMembers, user]);

  return (
    <div className="Settings">
      <div className="FormTitle">
        <p>הגדרות</p>
      </div>
      <div className="FormTitle">
        <p>פרטי משתמש</p>
      </div>
      <form
        className="SettingsForm"
        dir="rtl"
        lang="he"
        onSubmit={formik.handleSubmit}
      >
        <FormLabel id="demo-radio-buttons-group-label">מייל </FormLabel>

        <TextField
          variant={"standard"}
          id="email"
          name="email"
          margin="dense"
          autoComplete="off"
          disabled={true}
          value={formik.values.email}
        />
        <FormLabel id="demo-radio-buttons-group-label">מס' מנויים </FormLabel>

        <TextField
          variant={"standard"}
          id="numMembers"
          name="numMembers"
          margin="dense"
          autoComplete="off"
          disabled={true}
          value={numMembers}
        />

        <FormLabel id="demo-radio-buttons-group-label">שם משתמש </FormLabel>
        <TextField
          variant={"standard"}
          id="username"
          name="username"
          margin="dense"
          autoComplete="off"
          disabled={usernameDisabled}
          value={formik.values.username}
          error={formik.touched.username && Boolean(formik.errors.username)}
          onChange={formik.handleChange}
          onBlur={() => {
            setNameDisabled(true);
          }}
          helperText={formik.touched.username && formik.errors.username}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    setUsernameDisabled(!usernameDisabled);
                  }}
                  edge="end"
                >
                  <Edit />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <div className="FormTitle">
          <p>העדפות לטופס הרשמה</p>
        </div>
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
              variant={"standard"}
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
            variant={"standard"}
            id="name"
            name="name"
            margin="dense"
            autoComplete="off"
            disabled={nameDisabled}
            value={formik.values.name}
            error={formik.touched.name && Boolean(formik.errors.name)}
            onChange={formik.handleChange}
            onBlur={() => {
              setNameDisabled(true);
            }}
            helperText={formik.touched.name && formik.errors.name}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      setNameDisabled(!nameDisabled);
                    }}
                    edge="end"
                  >
                    <Edit />
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
            variant={"standard"}
            id="phone"
            name="phone"
            placeholder="טלפון נייד"
            margin="dense"
            autoComplete="off"
            disabled={phoneDisabled}
            value={formik.values.phone}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            onChange={formik.handleChange}
            onBlur={() => {
              setPhoneDisabled(true);
            }}
            helperText={formik.touched.phone && formik.errors.phone}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      setPhoneDisabled(!phoneDisabled);
                    }}
                    edge="end"
                  >
                    <Edit />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>

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
          label="שליחת מייל אישור עם פרטי ההסעה"
        />
      </form>
    </div>
  );
}

export default Settings;
