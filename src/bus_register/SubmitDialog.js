import "../utils/styles.css";
import {
  CircularProgress,
  Dialog,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import { doc, updateDoc, deleteField, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { Link } from "react-router-dom";

function SubmitDialog({
  submitDialogOpen,
  setSubmitDialogOpen,
  personalDetails,
  busDetails,
}) {
  const [confirmedDetails, setConfirmedDetails] = useState(false);
  const [registeredSuccessfully, setRegisteredSuccessfully] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tooManyPassengers, setTooManyPassengers] = useState(false);

  const closeSubmit = () => {
    if (!registeredSuccessfully) {
      setSubmitDialogOpen(false);
      setConfirmedDetails(false);
    }
  };
  const registerToBus = async () => {
    setLoading(true);
    const busRef = doc(db, "Buses", busDetails.busID);
    const docSnap = await getDoc(busRef);
    const registeredUsers = docSnap.data().registered_users;
    const userAlreadyRegistered =
      registeredUsers[personalDetails.email.replaceAll(".", "@")] !== undefined;
    if (docSnap.exists()) {
      const data = docSnap.data();
      const maxPassengers = docSnap.data().max_passengers;
      let totalPassengersToGame = data.totals.toGame,
        totalPassengersFromGame = data.totals.fromGame,
        totalPassengersMerkaz = data.totals.merkaz,
        totalPassengersMahir = data.totals.mahir,
        totalPassengersLatrun = data.totals.latrun,
        totalMembers = data.totals.members,
        totalOneTime = data.totals.oneTime;
      if (userAlreadyRegistered) {
        const previousDetails =
          registeredUsers[personalDetails.email.replaceAll(".", "@")];
        totalPassengersToGame =
          previousDetails.boardingStation === "אני נוסע/ת רק חזור"
            ? data.totals.toGame
            : data.totals.toGame - previousDetails.numPassengers;
        totalPassengersFromGame =
          previousDetails.alightingStation === "אני נוסע/ת רק הלוך"
            ? data.totals.fromGame
            : data.totals.fromGame - previousDetails.numPassengers;
        totalPassengersMerkaz =
          previousDetails.boardingStation === "רכבת מרכז" ||
          previousDetails.alightingStation === "רכבת מרכז"
            ? data.totals.merkaz - previousDetails.numPassengers
            : data.totals.merkaz;
        totalPassengersMahir =
          previousDetails.boardingStation === "חניון שפירים" ||
          previousDetails.alightingStation === "חניון שפירים"
            ? data.totals.mahir - previousDetails.numPassengers
            : data.totals.mahir;
        totalPassengersLatrun =
          previousDetails.boardingStation === "מחלף לטרון" ||
          previousDetails.alightingStation === "מחלף לטרון"
            ? data.totals.latrun - previousDetails.numPassengers
            : data.totals.latrun;
        totalMembers = data.totals.members - previousDetails.numMembers;
        totalOneTime =
          data.totals.oneTime -
          (previousDetails.numPassengers - previousDetails.numMembers);
      }
      totalPassengersToGame =
        personalDetails.boardingStation === "אני נוסע/ת רק חזור"
          ? totalPassengersToGame
          : totalPassengersToGame + personalDetails.numPassengers;
      totalPassengersFromGame =
        personalDetails.alightingStation === "אני נוסע/ת רק הלוך"
          ? totalPassengersFromGame
          : totalPassengersFromGame + personalDetails.numPassengers;
      totalPassengersMerkaz =
        personalDetails.boardingStation === "רכבת מרכז" ||
        personalDetails.alightingStation === "רכבת מרכז"
          ? totalPassengersMerkaz + personalDetails.numPassengers
          : totalPassengersMerkaz;
      totalPassengersMahir =
        personalDetails.boardingStation === "חניון שפירים" ||
        personalDetails.alightingStation === "חניון שפירים"
          ? totalPassengersMahir + personalDetails.numPassengers
          : totalPassengersMahir;
      totalPassengersLatrun =
        personalDetails.boardingStation === "מחלף לטרון" ||
        personalDetails.alightingStation === "מחלף לטרון"
          ? totalPassengersLatrun + personalDetails.numPassengers
          : totalPassengersLatrun;
      totalMembers = totalMembers + personalDetails.numMembers;
      totalOneTime =
        totalOneTime +
        (personalDetails.numPassengers - personalDetails.numMembers);

      if (
        totalPassengersToGame <= maxPassengers &&
        totalPassengersFromGame <= maxPassengers
      ) {
        await updateDoc(busRef, {
          [`registered_users.${personalDetails.email.replaceAll(".", "@")}`]:
            personalDetails,
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
        setRegisteredSuccessfully(true);
      } else {
        setTooManyPassengers(true);
      }
    } else {
      console.log("No such document!");
    }

    setLoading(false);
  };

  return (
    <Dialog open={submitDialogOpen} onClose={closeSubmit}>
      {loading && (
        <div className="LoadingDialog">
          <CircularProgress />
        </div>
      )}
      {!confirmedDetails && !registeredSuccessfully && !loading && (
        <div className="SubmitDialog">
          <div className="DialogTitle">
            <p>סיכום פרטים</p>
            <p>
              {busDetails.opponentName} -{" " + busDetails.gameDate}
            </p>
          </div>
          <TableContainer>
            <Table aria-label="simple table">
              <TableBody>
                <TableRow>
                  <TableCell variant="head" align="right">
                    שעת המשחק
                  </TableCell>
                  <TableCell align="right">{busDetails.gameTime}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head" align="right">
                    שעת יציאה
                  </TableCell>
                  <TableCell align="right">
                    {busDetails.busTime.merkaz}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head" align="right">
                    שם מלא
                  </TableCell>
                  <TableCell align="right">{personalDetails.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head" align="right">
                    מייל
                  </TableCell>
                  <TableCell align="right">{personalDetails.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head" align="right">
                    טלפון נייד
                  </TableCell>
                  <TableCell align="right">{personalDetails.phone}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head" align="right">
                    מס' נוסעים
                  </TableCell>
                  <TableCell align="right">
                    {personalDetails.numPassengers.toString() +
                      " (מתוכם " +
                      personalDetails.numMembers.toString() +
                      " מנויים)"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head" align="right">
                    תחנת עלייה
                  </TableCell>
                  <TableCell align="right">
                    {personalDetails.boardingStation}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head" align="right">
                    תחנת ירידה
                  </TableCell>
                  <TableCell align="right">
                    {personalDetails.alightingStation}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell variant="head" align="right">
                    מחיר
                  </TableCell>
                  <TableCell align="right">
                    {personalDetails.price.toString() + "₪"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <div className={"ConfirmCancel"}>
            <button
              className="SubmitButton"
              onClick={() => setConfirmedDetails(true)}
            >
              אישור והמשך
            </button>
            <button className="SubmitButton" onClick={closeSubmit}>
              חזרה
            </button>
          </div>
        </div>
      )}
      {confirmedDetails && !registeredSuccessfully && !loading && (
        <div className="SubmitDialog">
          <p className="DialogTitle">שימו לב!</p>
          <ul className="AttentionDetails">
            <li>
              אם אינכם מנויי הסעה וטרם שילמתם,{" "}
              <b>
                יש לשלם דרך{" "}
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
              </b>
            </li>
            <li>
              מי שלא שילם, <b>מקומו לא יישמר!</b>
            </li>
            <li>ההסעה יוצאת בזמן - אין המתנה למאחרים</li>
            <li>ההסעה חזור יוצאת מחניית השחקנים בארנה, כ-10 דק' מתום המשחק</li>
            <li>לשאלות ולפרטים נוספים ניתן לפנות לניב - 0503511920</li>
          </ul>
          <div className={"ConfirmCancel"}>
            <button className="SubmitButton" onClick={registerToBus}>
              אישור והרשמה
            </button>
            <button className="SubmitButton" onClick={closeSubmit}>
              ביטול
            </button>
          </div>
        </div>
      )}
      {registeredSuccessfully && !loading && (
        <div className="SubmitDialog">
          {tooManyPassengers ? (
            <p className="SuccessMessage">
              אנו מצטערים, אך נגמרו המקומות להסעה זו
            </p>
          ) : (
            <p className="SuccessMessage">
              נרשמתם בהצלחה!{" "}
              {personalDetails.sendMail &&
                `מייל עם הפרטים יישלח לכתובת ${personalDetails.email}`}
            </p>
          )}
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

export default SubmitDialog;
