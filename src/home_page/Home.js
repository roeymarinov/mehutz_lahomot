import "./Home.css";
import Header from "../header/Header";
import eilatLogo from "../assets/logo_eilat.png";

function Home() {
  const opponentName = "הפועל אילת";
  const gameTime = "20:00";
  const busTime = "18:00";
  const gameDate = "12/11";
  const gameDay = "יום שני";
  const court = "פיס ארנה";

  return (
    <div className="Home">
      <Header />
      <div className="Content">
        <p className="NextGameText">ההסעה הבאה:</p>
        <div className="GameCard">
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
        <button className="RegisterButton">הרשמה להסעה</button>
      </div>
    </div>
  );
}

export default Home;
