import "./Header.css";
import logo from "../assets/mehutz_lahomot_logo.png";
import SignInSignUp from "../sign_in_sign_up/SignIn";
import SignUp from "../sign_in_sign_up/SignUp";
import { useState } from "react";

function Header() {
  const [signInDialogOpen, setSignInDialogOpen] = useState(false);
  const [signUpDialogOpen, setSignUpDialogOpen] = useState(false);
  const goToSignInDialog = () => {
    setSignUpDialogOpen(false);
    setSignInDialogOpen(true);
  };
  const goToSignUpDialog = () => {
    setSignInDialogOpen(false);
    setSignUpDialogOpen(true);
  };
  return (
    <div className="Header">
      <img className="Logo" src={logo} alt="" />
      <p className="Title">הסעות מחוץ לחומות</p>
      <p className="Subtitle">
        הסעות מתל אביב למשחקי הבית של הפועל ירושלים בארנה
      </p>
      <button
        className="SignIn"
        onClick={() => {
          console.log("Sign in!");
          setSignInDialogOpen(true);
        }}
      >
        כניסה
      </button>
      <SignInSignUp
        signInDialogOpen={signInDialogOpen}
        setSignInDialogOpen={setSignInDialogOpen}
        goToSignUpDialog={goToSignUpDialog}
      />
      <SignUp
        signUpDialogOpen={signUpDialogOpen}
        setSignUpDialogOpen={setSignUpDialogOpen}
        goToSignInDialog={goToSignInDialog}
      />
    </div>
  );
}

export default Header;
