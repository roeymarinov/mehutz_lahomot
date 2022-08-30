import "./BusRegister.css";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useState } from "react";

function BusRegister() {
  const opponentName = "הפועל אילת";
  const gameTime = "20:00";
  const busTime = "18:00";
  const gameDate = "12/11";
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [numPassengers, setNumPassengers] = useState("");
  const [station, setStation] = useState("");

  const [usernameError, setUsernameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [emailError, setEmailError] = useState(false);
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
          <p>₪20/₪15</p>
        </div>
      </div>
      {/*<div className="InfoCard">*/}
      {/*  <ul>*/}
      {/*    <li>*/}
      {/*      ההסעה יוצאת מרכבת מרכז בתל אביב ועוצרת גם בחניון שפירים (הנתיב*/}
      {/*      המהיר) ובצומת שילת (מודיעין)*/}
      {/*    </li>*/}
      {/*    <li>ההסעה יוצאת בזמן - אין המתנה למאחרים</li>*/}
      {/*    <li>מחיר - 15 ש"ח לכיוון, או מנוי שנתי ב-400 ש"ח</li>*/}
      {/*    <li>תשלום דרך פייבוקס</li>*/}
      {/*    <li>לשאלות, נא לפנות לניב - 0503511920</li>*/}
      {/*  </ul>*/}
      {/*</div>*/}
      <div dir="rtl" lang="he">
        <FormControl fullWidth>
          <Select
            value={numPassengers}
            label=""
            displayEmpty
            onChange={(event) => {
              setNumPassengers(event.target.value);
            }}
          >
            <MenuItem value="">מס' נוסעים</MenuItem>
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={3}>4</MenuItem>
            <MenuItem value={3}>5</MenuItem>
            {/*<MenuItem value={3}>6</MenuItem>*/}
            {/*<MenuItem value={3}>7</MenuItem>*/}
            {/*<MenuItem value={3}>8</MenuItem>*/}
            {/*<MenuItem value={3}>9</MenuItem>*/}
            {/*<MenuItem value={3}>10</MenuItem>*/}
          </Select>
          <Select
            value={station}
            label=""
            displayEmpty
            onChange={(event) => {
              setStation(event.target.value);
            }}
          >
            <MenuItem value="">תחנת עלייה</MenuItem>
            <MenuItem value="רכבת מרכז">רכבת מרכז</MenuItem>
            <MenuItem value="חניון שפירים (הנתיב המהיר)">
              חניון שפירים (הנתיב המהיר)
            </MenuItem>
            <MenuItem value="צומת שילת">צומת שילת</MenuItem>
          </Select>
        </FormControl>
      </div>
      <TextField
        placeholder="שם"
        margin="dense"
        required={true}
        autoComplete="off"
        error={usernameError}
        onChange={(event) => {
          setUsername(event.target.value);
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
      <button className="SubmitButton">הרשמה</button>
    </div>
  );
}

export default BusRegister;
