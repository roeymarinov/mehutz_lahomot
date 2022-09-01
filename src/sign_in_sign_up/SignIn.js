import { Dialog, TextField } from "@mui/material";
import "../utils/styles.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { app } from "../utils/firebase";

const auth = getAuth(app);

function SignIn({ signInDialogOpen, setSignInDialogOpen, goToSignUpDialog }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const closeSignIn = () => {
    setSignInDialogOpen(false);
  };

  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        closeSignIn();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage, errorCode);
      });
  };

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === "Enter" && signInDialogOpen) {
        event.preventDefault();
        signIn();
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  });

  return (
    <Dialog open={signInDialogOpen} onClose={closeSignIn}>
      <p className="DialogTitle">התחברות לאתר</p>
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
        placeholder="סיסמה"
        margin="dense"
        required={true}
        autoComplete="off"
        error={passwordError}
        type="password"
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />
      <button className="EnterButton" onClick={signIn}>
        כניסה
      </button>
      <div className="NoUserText">
        <p>עדיין אין לכם משתמש?&nbsp; </p>
        <p className="RegisterText" onClick={goToSignUpDialog}>
          הירשמו
        </p>
      </div>
    </Dialog>
  );
}

export default SignIn;
