import "../utils/styles.css";
import { CircularProgress, Dialog, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { doc, updateDoc, deleteField, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { Link } from "react-router-dom";
import { AuthenticatedUserContext } from "../utils/UserProvider";
import * as yup from "yup";
import { useFormik } from "formik";

function CancelDialog({ cancelDialogOpen, setCancelDialogOpen, busDetails }) {
  const [confirmedCancel, setConfirmedCancel] = useState(false);
  const [canceledSuccessfully, setCanceledSuccessfully] = useState(false);
  const [loading, setLoading] = useState(true);
  const [personalDetails, setPersonalDetails] = useState(null);
  const { user } = useContext(AuthenticatedUserContext);
  const validationSchema = yup.object({
    email: yup
      .string()
      .email("הכניסו כתובת מייל תקינה")
      .required("אנא הכניסו כתובת מייל"),
  });
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setErrors }) => {
      const userRef = doc(db, "Users", values.email);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        setErrors({
          email:
            "כתובת המייל הזו שייכת למשתמש קיים, אנא התחברו לאתר כדי לבטל את הרישום",
        });
        return;
      }

      const busRef = doc(db, "Buses", busDetails.busID);
      getDoc(busRef).then((docSnap) => {
        if (docSnap.exists()) {
          const registeredUsers = docSnap.data().registered_users;
          if (
            registeredUsers[values.email.replaceAll(".", "@")] === undefined
          ) {
            setErrors({
              email: "כתובת המייל הזו אינה רשומה להסעה, אין צורך לבטל",
            });
          }
          setPersonalDetails(
            registeredUsers[values.email.replaceAll(".", "@")]
          );
        }
      });
    },
  });
  const closeSubmit = () => {
    if (!canceledSuccessfully) {
      setCancelDialogOpen(false);
      setConfirmedCancel(false);
    }
  };
  const cancelRegistrationToBus = async (email) => {
    setConfirmedCancel(true);
    setLoading(true);
    const busRef = doc(db, "Buses", busDetails.busID);
    const docSnap = await getDoc(busRef);
    const registeredUsers = docSnap.data().registered_users;
    const userAlreadyRegistered =
      registeredUsers[email.replaceAll(".", "@")] !== undefined;
    if (docSnap.exists() && userAlreadyRegistered) {
      const data = docSnap.data();

      const previousDetails = registeredUsers[email.replaceAll(".", "@")];
      const totalPassengersToGame =
          previousDetails.boardingStation === "אני נוסע/ת רק חזור"
            ? data.totals.toGame
            : data.totals.toGame - previousDetails.numPassengers,
        totalPassengersFromGame =
          previousDetails.alightingStation === "אני נוסע/ת רק הלוך"
            ? data.totals.fromGame
            : data.totals.fromGame - previousDetails.numPassengers,
        totalPassengersMerkaz =
          previousDetails.boardingStation === "רכבת מרכז" ||
          previousDetails.alightingStation === "רכבת מרכז"
            ? data.totals.merkaz - previousDetails.numPassengers
            : data.totals.merkaz,
        totalPassengersMahir =
          previousDetails.boardingStation === "חניון שפירים" ||
          previousDetails.alightingStation === "חניון שפירים"
            ? data.totals.mahir - previousDetails.numPassengers
            : data.totals.mahir,
        totalPassengersLatrun =
          previousDetails.boardingStation === "מחלף לטרון" ||
          previousDetails.alightingStation === "מחלף לטרון"
            ? data.totals.latrun - previousDetails.numPassengers
            : data.totals.latrun,
        totalMembers = data.totals.members - previousDetails.numMembers,
        totalOneTime =
          data.totals.oneTime -
          (previousDetails.numPassengers - previousDetails.numMembers);

      await updateDoc(busRef, {
        [`registered_users.${email.replaceAll(".", "@")}`]: deleteField(),
        totals: {
          mahir: totalPassengersMahir,
          merkaz: totalPassengersMerkaz,
          latrun: totalPassengersLatrun,
          toGame: totalPassengersToGame,
          fromGame: totalPassengersFromGame,
          members: totalMembers,
          oneTime: totalOneTime,
        },
      });
      setCanceledSuccessfully(true);
    } else {
      console.log("No such document!");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (user && !personalDetails) {
      const busRef = doc(db, "Buses", busDetails.busID);
      getDoc(busRef).then((docSnap) => {
        if (docSnap.exists()) {
          const registeredUsers = docSnap.data().registered_users;
          setPersonalDetails(registeredUsers[user.email.replaceAll(".", "@")]);
        }
      });
    }
    setLoading(false);
  }, [user]);

  return (
    <Dialog open={cancelDialogOpen} onClose={closeSubmit}>
      {loading && (
        <div className="LoadingDialog">
          <CircularProgress />
        </div>
      )}
      {!Boolean(personalDetails) &&
        !confirmedCancel &&
        !canceledSuccessfully &&
        !loading && (
          <form
            className={"CancelForm"}
            onSubmit={formik.handleSubmit}
            dir={"rtl"}
            lang="he"
          >
            <p>
              על מנת לבטל את הרישום, אנא הכניסו את כתובת המייל שנרשמתם איתה
              להסעה
            </p>
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
            <div className={"ConfirmCancel"}>
              <button
                className="SubmitButton"
                type={"button"}
                onClick={() => closeSubmit()}
              >
                חזרה
              </button>
              <button className="SubmitButton" type="submit">
                אישור
              </button>
            </div>
          </form>
        )}
      {Boolean(personalDetails) &&
        !confirmedCancel &&
        !canceledSuccessfully &&
        !loading && (
          <div className="SubmitDialog">
            <div className="DialogTitle">
              <p>ביטול רישום להסעה</p>
              <p>
                {busDetails.opponentName} -{" " + busDetails.gameDate}
              </p>
            </div>
            <p className={"CancelInfoText"}>
              לבטל רישום של {personalDetails.numPassengers} נוסעים להסעה על שם{" "}
              {personalDetails.name}?
            </p>
            <p className={"CancelInfoText"}>
              <b>שימו לב! </b>
              לחיצה על "אישור" תבטל סופית את הרשמתכם להסעה
            </p>
            <div className={"ConfirmCancel"}>
              <button
                className="SubmitButton"
                onClick={() => cancelRegistrationToBus(personalDetails.email)}
              >
                אישור
              </button>
              <button
                className="SubmitButton"
                onClick={() => {
                  if (user) {
                    closeSubmit();
                  } else {
                    setPersonalDetails(null);
                  }
                }}
              >
                חזרה
              </button>
            </div>
          </div>
        )}

      {Boolean(personalDetails) && canceledSuccessfully && !loading && (
        <div className="SubmitDialog">
          <p className="SuccessMessage">ביטול בוצע בהצלחה! </p>
          <Link to="/">
            <button className="SubmitButton" onClick={() => {}}>
              למסך הבית
            </button>
          </Link>
        </div>
      )}
    </Dialog>
  );
}

export default CancelDialog;
