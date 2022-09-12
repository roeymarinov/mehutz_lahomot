import { Dialog, IconButton, InputAdornment, TextField } from "@mui/material";
import "../utils/styles.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { app } from "../utils/firebase";
import { useFormik } from "formik";
import * as yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const auth = getAuth(app);

function SignIn({ signInDialogOpen, setSignInDialogOpen, goToSignUpDialog }) {
  const [showPassword, setShowPassword] = useState(false);
  const validationSchema = yup.object({
    email: yup
      .string()
      .email("הכניסו כתובת מייל תקינה")
      .required("אנא הכניסו כתובת מייל"),
    password: yup.string("אנא הכניסו סיסמה").required("אנא הכניסו סיסמה"),
  });
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setErrors }) => {
      signInWithEmailAndPassword(auth, values.email, values.password)
        .then(() => {
          // Signed in
          closeSignIn();
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage, errorCode);
          setErrors({ password: "כתובת המייל או הסיסמה שגויים" });
        });
    },
  });

  const closeSignIn = () => {
    setSignInDialogOpen(false);
  };

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === "Enter" && signInDialogOpen) {
        event.preventDefault();
        formik.handleSubmit();
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
        <button className="EnterButton" type="submit">
          כניסה
        </button>
      </form>
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
