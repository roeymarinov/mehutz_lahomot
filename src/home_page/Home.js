import "../utils/styles.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import {
  query,
  where,
  orderBy,
  collection,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import { AuthenticatedUserContext } from "../utils/UserProvider";
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
import bakkenLogo from "../assets/logo_bakken.png";
import googleMaps from "../assets/google_maps.png";
import waze from "../assets/waze.png";
import facebook from "../assets/facebook.png";
import whatsapp from "../assets/whatsapp.png";
import { CircularProgress } from "@mui/material";

function Home({
  signInDialogOpen,
  setSignInDialogOpen,
  signUpDialogOpen,
  setSignUpDialogOpen,
}) {
  // const [displayAsAdmin, setDisplayAsAdmin] = useState(false);
  const { user } = useContext(AuthenticatedUserContext);
  const [buses, setBuses] = useState([]);
  const navigate = useNavigate();
  // if (user) {
  //     const docRef = doc(db, "Users", user.uid);
  //     getDoc(docRef).then((docSnap) => {
  //         if (docSnap.exists()) {
  //             setDisplayAsAdmin(docSnap.data().admin);
  //         } else {
  //             // doc.data() will be undefined in this case
  //             console.log("No such document!");
  //         }
  //     });
  // }
  const timeToString = (date) => {
    return (
      date.toDate().getHours() +
      ":" +
      date.toDate().getMinutes().toString().padStart(2, "0")
    );
  };
  const [displayAsAdmin, setDisplayAsAdmin] = useState(false);
  const [loadingBuses, setLoadingBuses] = useState(true);
  const BusesRef = collection(db, "Buses");
  const nowDate = Timestamp.now().toDate();
  nowDate.setHours(0, 0, 0, 0);
  const nowStamp = Timestamp.fromDate(nowDate);
  console.log(nowStamp.toDate());
  const q = query(BusesRef, where("date", ">", nowStamp), orderBy("date"));
  useEffect(() => {
    if (user) {
      setDisplayAsAdmin(user.displayAsAdmin);
    }
    getDocs(q).then((querySnapshot) => {
      const busesArray = [];
      querySnapshot.forEach((doc) => {
        const busID = doc.id;
        const data = doc.data();
        const opponentName = data.opponent;
        const busTimeDayjs = dayjs(data.bus_time.toDate());
        const mahirTime = busTimeDayjs.add(15, "m");
        const latrunTime = busTimeDayjs.add(35, "m");
        const gameTime = timeToString(data.game_time);
        const busTime = {
          merkaz: timeToString(data.bus_time),
          mahir: timeToString(mahirTime),
          latrun: timeToString(latrunTime),
        };
        const gameDate =
          data.date.toDate().getDate() +
          "/" +
          (parseInt(data.date.toDate().getMonth()) + 1).toString();
        const gameDay = data.date.toDate().getDay();
        const isBusFull = data.total_passengers >= data.max_passengers;
        let isUserRegistered = false;

        if (user) {
          const registeredUsers = data.registered_users;
          isUserRegistered =
            registeredUsers[user.email.replaceAll(".", "@")] !== undefined;
        }
        busesArray.push({
          opponentName: opponentName,
          gameDate: gameDate,
          gameTime: gameTime,
          gameDay: gameDay,
          busTime: busTime,
          busID: busID,
          isBusFull: isBusFull,
          isUserRegistered: isUserRegistered,
        });
      });
      setBuses(busesArray);
      setLoadingBuses(false);
    });
  }, [user]);

  const convertNumToDayOfWeek = (num) => {
    switch (num) {
      case 0:
        return "יום ראשון";
      case 1:
        return "יום שני";
      case 2:
        return "יום שלישי";
      case 3:
        return "יום רביעי";
      case 4:
        return "יום חמישי";
      case 5:
        return "יום שישי";
      case 6:
        return "יום שבת";
      default:
        return "error";
    }
  };

  const convertNameToLogo = (name) => {
    switch (name) {
      case "הפועל אילת":
        return eilatLogo;
      case "הפועל באר שבע":
        return beerShevaLogo;
      case "הפועל גלבוע גליל":
        return gilboaGalilLogo;
      case "הפועל גליל עליון":
        return galilElionLogo;
      case "הפועל חיפה":
        return haifaLogo;
      case "הפועל תל אביב":
        return hapoelTlvLogo;
      case "בני הרצליה":
        return hertzeliyaLogo;
      case "הפועל חולון":
        return holonLogo;
      case "עירוני קרית אתא":
        return kiryatAtaLogo;
      case "מכבי תל אביב":
        return maccabiTlvLogo;
      case "עירוני נס ציונה":
        return nesZionaLogo;
      case "לודוויגסבורג":
        return ludwigsburgLogo;
      case "דרושאפקה":
        return darussafakaLogo;
      case "באקן":
        return bakkenLogo;
      default:
        return "error";
    }
  };

  return (
    <div className="Home">
      <p className="ContentSubtitle">ההסעה הקרובה:</p>
      {loadingBuses && <CircularProgress className={"LoadingBuses"} />}
      {buses.length > 0 && (
        <div className="GameCard">
          <div className="LogoInfo">
            <img
              className="OpponentLogo"
              src={convertNameToLogo(buses[0].opponentName)}
              alt="opponent logo"
            />

            <div className="GameInfo">
              <h3 className="OpponentName">{buses[0].opponentName}</h3>
              <p>
                {convertNumToDayOfWeek(buses[0].gameDay)} {buses[0].gameDate}
              </p>
              <p>משחק: {buses[0].gameTime}</p>
              <p>הסעה: {buses[0].busTime.merkaz}</p>
              <p>פיס ארנה</p>
              <a
                href={"https://tickets.hapoel.co.il/"}
                target="_blank"
                rel="noopener noreferrer"
                className={"TicketsLink"}
              >
                כרטיסים למשחק
              </a>
            </div>
          </div>
          <button
            className="RegisterButton"
            disabled={buses[0].isBusFull}
            onClick={() => {
              if (user) {
                navigate("/bus", { state: buses[0] });
              } else {
                setSignInDialogOpen(true);
              }
            }}
          >
            {" "}
            {buses[0].isUserRegistered
              ? "עריכת רישום"
              : buses[0].isBusFull
              ? "ההסעה מלאה"
              : "לפרטים והרשמה"}
          </button>
        </div>
      )}
      {displayAsAdmin && <p className="ContentSubtitle">הסעות נוספות:</p>}
      {displayAsAdmin &&
        buses.length > 1 &&
        buses.slice(1).map((bus, index) => {
          index = index + 1;
          return (
            <div className="GameCard" key={index}>
              <div className="LogoInfo">
                <img
                  className="OpponentLogo"
                  src={convertNameToLogo(buses[index].opponentName)}
                  alt="opponent logo"
                />

                <div className="GameInfo">
                  <h3 className="OpponentName">{buses[index].opponentName}</h3>
                  <p>
                    {convertNumToDayOfWeek(buses[index].gameDay)}{" "}
                    {buses[index].gameDate}
                  </p>
                  <p>משחק: {buses[index].gameTime}</p>
                  <p>הסעה: {buses[index].busTime.merkaz}</p>
                  <p>פיס ארנה</p>
                  <a
                    href={"https://tickets.hapoel.co.il/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={"TicketsLink"}
                  >
                    כרטיסים למשחק
                  </a>
                </div>
              </div>
              <button
                className="RegisterButton"
                disabled={buses[index].isBusFull}
                onClick={() => {
                  if (user) {
                    navigate("/bus", { state: buses[0] });
                  } else {
                    setSignInDialogOpen(true);
                  }
                }}
              >
                {" "}
                {buses[index].isUserRegistered
                  ? "עריכת רישום"
                  : buses[index].isBusFull
                  ? "ההסעה מלאה"
                  : "לפרטים והרשמה"}
              </button>
            </div>
          );
        })}

      {displayAsAdmin && (
        <Link className="RegisterButtonLink" to="add_bus">
          <button className="RegisterButton">הוספת הסעה</button>
        </Link>
      )}
      <a
        className="FacebookButton"
        href={"https://chat.whatsapp.com/Jl6sAaAGbTE4MYUc6nCvgy"}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={whatsapp} alt={"facebook logo"} />
        <div>לקבוצת הוואטסאפ</div>
      </a>
      <a
        className="FacebookButton"
        href={"https://www.facebook.com/groups/146607822184153"}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={facebook} alt={"facebook logo"} />
        <div>לקבוצת הפייסבוק</div>
      </a>
      <a
        className="FacebookButton"
        href={"https://www.facebook.com/mehutz.la"}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={facebook} alt={"facebook logo"} />
        <div>לדף הפייסבוק</div>
      </a>

      <p className="ContentSubtitle">מסלול:</p>
      <div className="GameCard">
        <ul>
          <li>
            <div className={"StationInfo"}>
              <p>רכבת מרכז</p>

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
                  href={"https://waze.com/ul/hsv8wxb6kg"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={waze} alt={""} className="NavigationLogo" />
                </a>
              </div>
            </div>
          </li>
          <li>
            <div className={"StationInfo"}>
              <p>חניון שפירים - הנתיב המהיר</p>

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
          </li>
          <li>
            <div className={"StationInfo"}>
              <p>מחלף לטרון</p>
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
          </li>
          <li>
            <div className={"StationInfo"}>
              <p>פיס ארנה</p>

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
          </li>
        </ul>
      </div>
      <p className="ContentSubtitle">מחירון:</p>
      <div className="GameCard">
        <ul>
          <li>כיוון אחד - ₪20</li>
          <li>כיוון אחד (מחלף לטרון) - ₪15</li>
          <li>מנוי שנתי - ₪330</li>
        </ul>
      </div>
    </div>
  );
}

export default Home;
