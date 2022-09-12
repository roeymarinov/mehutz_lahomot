import "../utils/styles.css";
import {
  Select,
  MenuItem,
  FormControl,
  TextField,
  FormHelperText,
  CircularProgress,
  Dialog,
} from "@mui/material";
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
import ludwigsburgLogo from "../assets/logo_ludwigsburg.png";
import darussafakaLogo from "../assets/logo_darussafaka.png";
import { DesktopDatePicker, TimePicker } from "@mui/x-date-pickers";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import * as yup from "yup";
import { useFormik } from "formik";
import { Link } from "react-router-dom";

function AddBus() {
  const [gameDate, setGameDate] = useState(dayjs());
  const [gameTime, setGameTime] = useState(dayjs());
  const [busTime, setBusTime] = useState(dayjs());
  const [uploadedBus, setUploadedBus] = useState(false);
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
    { name: "לודוויגסבורג", logo: ludwigsburgLogo },
    { name: "דרושאפקה", logo: darussafakaLogo },
  ];
  const validationSchema = yup.object({
    opponentName: yup.string().required("אנא בחר יריבה"),
    maxPassengers: yup
      .number()
      .min(1, "אנא הכנס מספר גדול מ-0")
      .required("אנא בחר מס' נוסעים מקסימלי"),
  });
  const formik = useFormik({
    initialValues: {
      opponentName: "",
      maxPassengers: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, actions) => {
      addBusToDB({
        date: gameDate.toDate(),
        game_time: gameTime.toDate(),
        bus_time: busTime.toDate(),
        opponent: formik.values.opponentName,
        registered_users: [],
        total_passengers: 0,
        max_passengers: formik.values.maxPassengers,
      });
      actions.setSubmitting(false);
      setUploadedBus(true);
    },
  });
  const addBusToDB = (busInfo) => {
    addDoc(collection(db, "Buses"), busInfo).then(() =>
      console.log("uploaded bus!")
    );
  };
  return (
    <div className="BusRegister">
      {formik.isSubmitting && (
        <Dialog open={true}>
          {" "}
          <div className="LoadingDialog">
            <CircularProgress />
          </div>
        </Dialog>
      )}
      {!formik.isSubmitting && uploadedBus && (
        <Dialog open={true}>
          <div className={"SubmitDialog"}>
            <p className="SuccessMessage">ההסעה נוספה בהצלחה!</p>
            <Link to="/">
              <button className="SubmitButton" onClick={() => {}}>
                למסך הבית
              </button>
            </Link>
          </div>
        </Dialog>
      )}
      {
        <div className={"BusRegister"}>
          <div className="FormTitle">
            <p>יצירת הסעה</p>
          </div>
          <form
            className="BusForm"
            dir="rtl"
            lang="he"
            onSubmit={formik.handleSubmit}
          >
            <FormControl>
              <div className={"ChooseOpponent"}>
                <Select
                  id={"opponentName"}
                  name={"opponentName"}
                  className="AddBusInput"
                  value={formik.values.opponentName}
                  label=""
                  displayEmpty
                  error={
                    formik.touched.opponentName &&
                    Boolean(formik.errors.opponentName)
                  }
                  onChange={formik.handleChange}
                >
                  <MenuItem value="">בחר יריבה</MenuItem>
                  {opponents.map((opponent) => {
                    return (
                      <MenuItem value={opponent.name} key={opponent.name}>
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
                {formik.touched.opponentName &&
                  Boolean(formik.errors.opponentName) && (
                    <FormHelperText error={true}>
                      {formik.touched.opponentName &&
                        formik.errors.opponentName}
                    </FormHelperText>
                  )}
              </div>
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
              <div className="AddBusInput">
                <p>מס' נוסעים מקסימלי</p>
                <TextField
                  id="maxPassengers"
                  name="maxPassengers"
                  placeholder="הכנס מספר"
                  margin="dense"
                  autoComplete="off"
                  value={formik.values.maxPassengers}
                  error={
                    formik.touched.maxPassengers &&
                    Boolean(formik.errors.maxPassengers)
                  }
                  onChange={formik.handleChange}
                  helperText={
                    formik.touched.maxPassengers && formik.errors.maxPassengers
                  }
                />
              </div>
            </FormControl>

            <button className="SubmitButton" type={"submit"}>
              צור הסעה
            </button>
          </form>
        </div>
      }
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
