import "../utils/styles.css";
import eilatLogo from "../assets/logo_eilat.png";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase";
import { AuthenticatedUserContext } from "../utils/UserProvider";

function Home() {
  const opponentName = "הפועל אילת";
  const gameTime = "20:00";
  const busTime = "18:00";
  const gameDate = "12/11";
  const gameDay = "יום שני";
  const court = "פיס ארנה";
  // const [displayAsAdmin, setDisplayAsAdmin] = useState(false);
  const { user, setUser } = useContext(AuthenticatedUserContext);
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

  return (
    <div className="Home">
      <p className="ContentSubtitle">ההסעה הקרובה:</p>
      <div className="GameCard">
        <div className="LogoInfo">
          <img className="OpponentLogo" src={eilatLogo} alt="opponent logo" />
          <div className="GameInfo">
            <h3 className="OpponentName">{opponentName}</h3>
            <p>
              {gameDay} {gameDate}
            </p>
            <p>משחק: {gameTime}</p>
            <p>הסעה: {busTime}</p>
            <p>{court}</p>
          </div>
        </div>
        <Link className="RegisterButtonLink" to="bus">
          <button className="RegisterButton">לפרטים והרשמה</button>
        </Link>
      </div>
      {displayAsAdmin && <p className="ContentSubtitle">הסעות נוספות:</p>}
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
