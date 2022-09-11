import "../utils/styles.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { query, orderBy, collection, getDocs } from "firebase/firestore";
import { db } from "../utils/firebase";
import { AuthenticatedUserContext } from "../utils/UserProvider";
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

function Home() {
  // const [displayAsAdmin, setDisplayAsAdmin] = useState(false);
  const { user, setUser } = useContext(AuthenticatedUserContext);
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
  const displayAsAdmin = user ? user.displayAsAdmin : false;
  const BusesRef = collection(db, "Buses");
  const q = query(BusesRef, orderBy("date"));
  getDocs(q).then((querySnapshot) => {
    const busesArray = [];
    querySnapshot.forEach((doc) => {
      const busID = doc.id;
      const data = doc.data();
      const opponentName = data.opponent;
      const gameTime =
        data.game_time.toDate().getHours() +
        ":" +
        data.game_time.toDate().getMinutes();
      const busTime =
        data.bus_time.toDate().getHours() +
        ":" +
        data.bus_time.toDate().getMinutes();
      const gameDate =
        data.date.toDate().getDate() +
        "/" +
        (parseInt(data.date.toDate().getMonth()) + 1).toString();
      const gameDay = data.date.toDate().getDay();
      const isBusFull = data.total_passengers >= data.max_passengers;
      busesArray.push({
        opponentName: opponentName,
        gameDate: gameDate,
        gameTime: gameTime,
        gameDay: gameDay,
        busTime: busTime,
        busID: busID,
        isBusFull: isBusFull,
      });
    });
    setBuses(busesArray);
  });

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
      default:
        return "error";
    }
  };

  return (
    <div className="Home">
      <p className="ContentSubtitle">ההסעה הקרובה:</p>
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
              <p>הסעה: {buses[0].busTime}</p>
              <p>פיס ארנה</p>
            </div>
          </div>
          <button
            className="RegisterButton"
            disabled={buses[0].isBusFull}
            onClick={() => {
              navigate("/bus", { state: buses[0] });
            }}
          >
            {" "}
            {buses[0].isBusFull ? "ההסעה מלאה" : "לפרטים והרשמה"}
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
                  <p>הסעה: {buses[index].busTime}</p>
                  <p>פיס ארנה</p>
                </div>
              </div>
              <button
                className="RegisterButton"
                disabled={buses[index].isBusFull}
                onClick={() => {
                  navigate("/bus", { state: buses[index] });
                }}
              >
                {" "}
                {buses[index].isBusFull ? "ההסעה מלאה" : "לפרטים והרשמה"}
              </button>
            </div>
          );
        })}

      {displayAsAdmin && (
        <Link className="RegisterButtonLink" to="add_bus">
          <button className="RegisterButton">הוספת הסעה</button>
        </Link>
      )}

      <p className="ContentSubtitle">מסלול:</p>
      <div className="GameCard">
        <ul>
          <li>רכבת מרכז</li>
          <li>חניון שפירים (הנתיב המהיר)</li>
          <li>צומת שילת</li>
          <li>פיס ארנה</li>
        </ul>
      </div>
      <p className="ContentSubtitle">מחירון:</p>
      <div className="GameCard">
        <ul>
          <li>כיוון אחד - ₪20</li>
          <li>כיוון אחד (צומת שילת) - ₪15</li>
          <li>מנוי שנתי - ₪370</li>
        </ul>
      </div>
    </div>
  );
}

export default Home;
