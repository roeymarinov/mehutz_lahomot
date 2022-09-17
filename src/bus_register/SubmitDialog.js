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
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
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
    if (docSnap.exists()) {
      const data = docSnap.data();
      const maxPassengers = docSnap.data().max_passengers;
      const totalPassengersToGame =
        personalDetails.boardingStation === "אני נוסע/ת רק חזור"
          ? data.totals.toGame
          : data.totals.toGame + personalDetails.numPassengers;
      const totalPassengersFromGame =
        personalDetails.alightingStation === "אני נוסע/ת רק הלוך"
          ? data.totals.fromGame
          : data.totals.fromGame + personalDetails.numPassengers;
      const totalPassengersMerkaz =
        personalDetails.boardingStation === "רכבת מרכז" ||
        personalDetails.alightingStation === "רכבת מרכז"
          ? data.totals.merkaz + personalDetails.numPassengers
          : data.totals.merkaz;
      const totalPassengersMahir =
        personalDetails.boardingStation === "חניון שפירים" ||
        personalDetails.alightingStation === "חניון שפירים"
          ? data.totals.mahir + personalDetails.numPassengers
          : data.totals.mahir;
      const totalPassengersLatrun =
        personalDetails.boardingStation === "מחלף לטרון" ||
        personalDetails.alightingStation === "מחלף לטרון"
          ? data.totals.latrun + personalDetails.numPassengers
          : data.totals.latrun;
      const totalMembers = data.totals.members + personalDetails.numMembers;
      const totalOneTime =
        data.totals.oneTime +
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
                  <TableCell align="right">{busDetails.busTime}</TableCell>
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
                    {personalDetails.numPassengers}
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
                  <TableCell align="right">20</TableCell>
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
            <li>ההסעה יוצאת בזמן - אין המתנה למאחרים</li>
            <li>ההסעה חזור יוצאת מחניית השחקנים בארנה</li>
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
