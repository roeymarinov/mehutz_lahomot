import "../utils/styles.css";
import { Select, MenuItem, FormControl, TextField } from "@mui/material";
import { useState } from "react";
import dayjs from "dayjs";
import eilatLogo from "../assets/logo_eilat.png";
import beerShevaLogo from "../assets/logo_beer_sheva.png";
import gilboaGalilLogo from "../assets/logo_gilboa_galil.png";
import galilElionLogo from "../assets/logo_galil_elion.png";
import haifaLogo from "../assets/logo_haifa.png";
import hapoelTlvLogo from "../assets/logo_hapoel_tlv.png";
import hertzeliyaLogo from "../assets/logo_hertzeliya.png";
import holonLogo from "../assets/logo_holon.png";
import kiryatAtaLogo from "../assets/logo_kiryat_ata.png";
import maccabiTlvLogo from "../assets/logo_maccabi_tlv.png";
import nesZionaLogo from "../assets/logo_nes_ziona.png";
import { DesktopDatePicker, TimePicker } from "@mui/x-date-pickers";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

function AddBus() {
  const [opponentName, setOpponentName] = useState("");
  const [gameDate, setGameDate] = useState(dayjs());
  const [gameTime, setGameTime] = useState(dayjs());
  const [busTime, setBusTime] = useState(dayjs());
  const opponents = [
    { name: "הפועל חולון", logo: holonLogo },
    { name: "בני הרצליה", logo: hertzeliyaLogo },
    { name: "מכבי תל אביב", logo: maccabiTlvLogo },
    { name: "הפועל גליל עליון", logo: galilElionLogo },
    { name: "הפועל חיפה", logo: haifaLogo },
    { name: "הפועל תל אביב", logo: hapoelTlvLogo },
    { name: "הפועל גלבוע גליל", logo: gilboaGalilLogo },
    { name: "הפועל אילת", logo: eilatLogo },
    { name: "עירוני נס ציונה", logo: nesZionaLogo },
    { name: "הפועל באר שבע", logo: beerShevaLogo },
    { name: "עירוני קרית אתא", logo: kiryatAtaLogo },
  ];

  const addBusToDB = (busInfo) => {
    addDoc(collection(db, "Buses"), busInfo).then(() =>
      console.log("uploaded bus!")
    );
  };
  return (
    <div className="BusRegister">
      <div className="FormTitle">
        <p>יצירת הסעה</p>
      </div>
      <div className="BusForm" dir="rtl" lang="he">
        <FormControl>
          <Select
            className="AddBusInput"
            value={opponentName}
            label=""
            displayEmpty
            onChange={(event) => {
              setOpponentName(event.target.value);
            }}
          >
            <MenuItem value="">בחר יריבה</MenuItem>

            {opponents.map((opponent) => {
              return (
                <MenuItem value={opponent.name}>
                  <div className="OpponentMenuItem">
                    <img
                      className="MenuItemLogo"
                      src={opponent.logo}
                      alt={opponent.name}
                    />
                    <p>{opponent.name}</p>
                  </div>
                </MenuItem>
              );
            })}
          </Select>
          <div className="AddBusInput">
            <p>תאריך המשחק</p>
            <DesktopDatePicker
              label=""
              inputFormat="DD/MM/YYYY"
              value={gameDate}
              onChange={(newDate) => {
                setGameDate(newDate);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </div>
          <div className="AddBusInput">
            <p>שעת המשחק</p>
            <TimePicker
              className={"AddBusInput"}
              label=""
              ampm={false}
              value={gameTime}
              onChange={(newTime) => {
                setGameTime(newTime);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </div>
          <div className="AddBusInput">
            <p>שעת ההסעה</p>
            <TimePicker
              className={"AddBusInput"}
              label=""
              ampm={false}
              value={busTime}
              onChange={(newTime) => {
                setBusTime(newTime);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </div>
        </FormControl>
      </div>

      <button
        className="SubmitButton"
        onClick={() =>
          addBusToDB({
            date: gameDate.toDate(),
            game_time: gameTime.toDate(),
            bus_time: busTime.toDate(),
            opponent: opponentName,
          })
        }
      >
        המשך
      </button>
    </div>
  );
}

// function OpponentMenuItem({ opponentName, logo }) {
//   return (
//     <MenuItem value={opponentName}>
//       <div>
//         <img className="MenuItemLogo" src={logo} alt={opponentName} />
//         <p>{opponentName}</p>
//       </div>
//     </MenuItem>
//   );
// }

export default AddBus;
