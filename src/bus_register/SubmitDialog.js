import "../utils/styles.css";
import {
  CircularProgress,
  Dialog,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
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

  const closeSubmit = () => {
    if (!registeredSuccessfully) {
      setSubmitDialogOpen(false);
      setConfirmedDetails(false);
    }
  };

  const registerToBus = async () => {
    setLoading(true);
    const busRef = doc(db, "Buses", "Vu6SMFN0XRcPZ1Q9KlS3");

    // Set the "capital" field of the city 'DC'
    await updateDoc(busRef, {
      registered_users: arrayUnion(personalDetails),
    });
    setRegisteredSuccessfully(true);
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
          <p className="SuccessMessage">
            נרשמתם בהצלחה! מייל עם הפרטים יישלח לכתובת {personalDetails.email}
          </p>
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
