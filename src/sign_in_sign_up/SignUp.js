import { Dialog, IconButton, InputAdornment, TextField } from "@mui/material";
import "../utils/styles.css";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { app, db } from "../utils/firebase";
import { AuthenticatedUserContext } from "../utils/UserProvider";
import { doc, getDoc, setDoc } from "firebase/firestore";
import * as yup from "yup";
import { useFormik } from "formik";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const auth = getAuth(app);
auth.languageCode = "iw";

function SignUp({ signUpDialogOpen, setSignUpDialogOpen, goToSignInDialog }) {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = yup.object({
    email: yup
      .string()
      .lowercase()
      .email("הכניסו כתובת מייל תקינה")
      .required("אנא הכניסו כתובת מייל"),
    password: yup
      .string()
      .min(8, "דרושים לפחות 8 תווים")
      .required("אנא הכניסו סיסמה"),
    username: yup
      .string()
      .min(4, "אנא הכניסו שם מלא")
      .required("אנא הכניסו שם מלא"),
    confirmPassword: yup
      .string()
      .min(8, "דרושים לפחות 8 תווים")
      .required("אנא הכניסו סיסמה")
      .oneOf([yup.ref("password"), null], "אנא הכניסו סיסמאות זהות"),
  });
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setErrors }) => {
      createUserWithEmailAndPassword(auth, values.email, values.password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          updateProfile(auth.currentUser, {
            displayName: values.username,
          }).then(() => {
            // Profile updated!
            // ...
            setDoc(doc(db, "Users", user.email), {
              username: values.username,
              email: values.email,
              admin: false,
              preferences: {},
            }).then(() => {
              sendEmailVerification(auth.currentUser).then(() => {
                // Email verification sent!
                // ...
                closeSignUp();
              });
            });
          });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage, errorCode);
          setErrors({ email: "כתובת המייל כבר רשומה במערכת" });
        });
    },
  });
  const closeSignUp = () => {
    setSignUpDialogOpen(false);
  };

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === "Enter" && signUpDialogOpen) {
        event.preventDefault();
        formik.handleSubmit();
      }
    };

    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  });

  // Handle user state changes
  async function onAuthStateChanged(authenticatedUser) {
    if (authenticatedUser && !user) {
      let displayAsAdmin = false;
      const docRef = doc(db, "Users", authenticatedUser.email);
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          displayAsAdmin = docSnap.data().admin;
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
        setUser({ ...authenticatedUser, displayAsAdmin: displayAsAdmin });
      });
    } else if (!authenticatedUser) {
      setUser(null);
    }
  }

  useEffect(() => {
    return auth.onAuthStateChanged(onAuthStateChanged); // unsubscribe on unmount
  });

  return (
    <Dialog open={signUpDialogOpen} onClose={closeSignUp}>
      <p className="DialogTitle">הרשמה לאתר</p>
      <form className={"SignInForm"} onSubmit={formik.handleSubmit}>
        <TextField
          id="email"
          name="email"
          placeholder="מייל"
          margin="dense"
          autoComplete="off"
          value={formik.values.email}
          error={formik.touched.email && Boolean(formik.errors.email)}
          onChange={formik.handleChange}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          id="password"
          name="password"
          placeholder="סיסמה"
          margin="dense"
          autoComplete="off"
          value={formik.values.password}
          error={formik.touched.password && Boolean(formik.errors.password)}
          type={showPassword ? "text" : "password"}
          onChange={formik.handleChange}
          helperText={formik.touched.password && formik.errors.password}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          id="confirmPassword"
          name="confirmPassword"
          placeholder="אימות סיסמה"
          margin="dense"
          autoComplete="off"
          value={formik.values.confirmPassword}
          error={
            formik.touched.confirmPassword &&
            Boolean(formik.errors.confirmPassword)
          }
          type={showPassword ? "text" : "password"}
          onChange={formik.handleChange}
          helperText={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          id="username"
          name="username"
          placeholder="שם מלא"
          margin="dense"
          autoComplete="off"
          value={formik.values.username}
          error={formik.touched.username && Boolean(formik.errors.username)}
          onChange={formik.handleChange}
          helperText={formik.touched.username && formik.errors.username}
        />
        <button className="EnterButton" type="submit">
          הרשמה
        </button>
      </form>

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
