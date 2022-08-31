import "../styles.css";
import {
  Dialog,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";

function SubmitDialog({
  submitDialogOpen,
  setSubmitDialogOpen,
  personalDetails,
  busDetails,
}) {
  const [confirmedDetails, setConfirmedDetails] = useState(false);

  const closeSubmit = () => {
    setSubmitDialogOpen(false);
    setConfirmedDetails(false);
  };

  return (
    <Dialog open={submitDialogOpen} onClose={closeSubmit}>
      {!confirmedDetails && (
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
          <button
            className="SubmitButton"
            onClick={() => setConfirmedDetails(true)}
          >
            אישור והמשך
          </button>
        </div>
      )}
      {confirmedDetails && (
        <div className="SubmitDialog">
          <p className="DialogTitle">שימו לב!</p>
          <ul className="AttentionDetails">
            <li>ההסעה יוצאת בזמן - אין המתנה למאחרים</li>
            <li>ההסעה חזור יוצאת מחניית השחקנים בארנה</li>
            <li>לשאלות ולפרטים נוספים ניתן לפנות לניב - 0503511920</li>
          </ul>
          <button className="SubmitButton" onClick={closeSubmit}>
            אישור והרשמה
          </button>
        </div>
      )}
    </Dialog>
  );
}

export default SubmitDialog;
