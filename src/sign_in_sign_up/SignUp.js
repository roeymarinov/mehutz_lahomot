import { Dialog, TextField } from "@mui/material";
import "./SignInSignUp.css";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { useEffect, useState } from "react";
import { app } from "../firebase";

const auth = getAuth(app);
auth.languageCode = "iw";

function SignUp({ signUpDialogOpen, setSignUpDialogOpen, goToSignInDialog }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);

  const closeSignUp = () => {
    setSignUpDialogOpen(false);
  };

  const signUp = () => {
    console.log(email, password, username);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        updateProfile(auth.currentUser, {
          displayName: username,
        })
          .then(() => {
            // Profile updated!
            // ...
            console.log(auth.currentUser.displayName);
            sendEmailVerification(auth.currentUser).then(() => {
              // Email verification sent!
              // ...
              console.log(auth.currentUser.emailVerified);
              closeSignUp();
            });
          })
          .catch((error) => {
            // An error occurred
            // ...
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage, errorCode);
      });
  };

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === "Enter" && signUpDialogOpen) {
        event.preventDefault();
        signUp();
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  });

  return (
    <Dialog open={signUpDialogOpen} onClose={closeSignUp}>
      <p className="DialogTitle">הרשמה לאתר</p>
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
      <TextField
        placeholder="שם"
        margin="dense"
        required={true}
        autoComplete="off"
        error={usernameError}
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      />
      <button className="EnterButton" onClick={signUp}>
        הרשמה
      </button>
      <div className="NoUserText">
        <p>כבר יש לכם משתמש?&nbsp; </p>
        <p className="RegisterText" onClick={goToSignInDialog}>
          התחברו
        </p>
      </div>
    </Dialog>
  );
}

export default SignUp;
