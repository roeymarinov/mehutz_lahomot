import "./Header.css"
import logo from "../assets/mehutz_lahomot_logo.png"

function Header() {
    return (
            <div className="Header">

                <img className="Logo" src={logo} alt=""/>
                <text className="Title">
                    הסעות מחוץ לחומות
                </text>
                <text className="Subtitle">
                    הסעות מתל אביב למשחקי הבית של הפועל ירושלים בארנה
                </text>
                <button className="SignIn" onClick={() => {
                    console.log("Sign in!")
                }}>
                    התחברות
                </button>
            </div>
    );
}

export default Header;
