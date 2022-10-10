import { Dialog, TextField } from "@mui/material";
import "../utils/styles.css";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useEffect, useState } from "react";
import { app } from "../utils/firebase";
import { useFormik } from "formik";
import * as yup from "yup";

const auth = getAuth(app);

function ResetPassword({
  resetPasswordDialogOpen,
  setResetPasswordDialogOpen,
  goToSignInDialog,
}) {
  const [resetSuccessfully, setResetSuccessfully] = useState(false);
  const [email, setEmail] = useState("");

  const validationSchema = yup.object({
    email: yup
      .string()
      .email("הכניסו כתובת מייל תקינה")
      .required("אנא הכניסו כתובת מייל"),
  });
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setErrors }) => {
      sendPasswordResetEmail(auth, values.email)
        .then(() => {
          setResetSuccessfully(true);
          setEmail(formik.values.email);
          formik.handleReset(undefined);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage, errorCode);
          setErrors({ email: "כתובת המייל אינה רשומה לאתר" });
        });
    },
  });

  const closeResetPassword = () => {
    setResetPasswordDialogOpen(false);
    formik.handleReset(undefined);
  };

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === "Enter" && resetPasswordDialogOpen) {
        event.preventDefault();
        formik.handleSubmit();
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  });

  useEffect(() => {
    formik.handleReset(undefined);
  }, [resetPasswordDialogOpen]);

  return (
    <Dialog open={resetPasswordDialogOpen} onClose={closeResetPassword}>
      {!resetSuccessfully && (
        <div className={"SubmitDialog"}>
          <p className="DialogTitle">איפוס סיסמה</p>
          <p className={"SignUpInfo"}>
            לאיפוס סיסמה, אנא הכניסו את כתובת המייל שלכם הרשומה לאתר
          </p>
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
            <button className="EnterButton" type="submit">
              אישור
            </button>
          </form>
          <div className="NoUserText">
            <p>לא צריכים לאפס סיסמה?&nbsp; </p>
            <p className="RegisterText" onClick={goToSignInDialog}>
              התחברו
            </p>
          </div>
        </div>
      )}
      {resetSuccessfully && (
        <div className={"SubmitDialog"}>
          <p className="SuccessMessage">נשלח מייל איפוס סיסמה לכתובת {email}</p>
          <p className={"SuccessMessage"}>
            כדי לאפס את הסיסמה, עקבו אחר ההנחיות במייל זה
          </p>
          <button
            className="SubmitButton"
            onClick={() => {
              setResetPasswordDialogOpen(false);
              setResetSuccessfully(false);
            }}
          >
            סגירה
          </button>
        </div>
      )}
    </Dialog>
  );
}

export default ResetPassword;
