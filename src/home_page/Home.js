import "./Home.css"
import Header from "../header/Header";
import eilatLogo from "../assets/logo_eilat.png"



function Home() {
    const opponentName = "הפועל אילת"
    const gameTime = "20:00"
    const busTime = "18:00"
    const gameDate = "12/11"
    const gameDay = "יום שני"
    const court = "פיס ארנה"
    
    return (
        <div className="Home">
            <Header/>
            <div className="Content">
                <text className="NextGameText">
                    ההסעה הבאה:
                </text>
                <div className="GameCard">
                    <img className="OpponentLogo" src={eilatLogo} alt="opponent logo"/>
                    <div className="GameInfo">
                        <h3 className="OpponentName">
                            {opponentName}
                        </h3>
                        <text>
                            {gameDay} {gameDate}
                        </text>
                        <text>
                            משחק: {gameTime}
                        </text>
                        <text>
                            הסעה: {busTime}
                        </text>
                        <text>
                            {court}
                        </text>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
