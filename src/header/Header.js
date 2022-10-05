import "../utils/styles.css";
import logo from "../assets/mehutz_lahomot_logo.png";
import SignInSignUp from "../sign_in_sign_up/SignIn";
import SignUp from "../sign_in_sign_up/SignUp";
import { useContext, useState } from "react";
import { AuthenticatedUserContext } from "../utils/UserProvider";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Menu, MenuItem } from "@mui/material";
import { getAuth, signOut } from "firebase/auth";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Header() {
  const auth = getAuth();
  const [signInDialogOpen, setSignInDialogOpen] = useState(false);
  const [signUpDialogOpen, setSignUpDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const profileMenuOpen = Boolean(anchorEl);
  const nav = useNavigate();

  const clickProfile = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const closeProfileMenu = () => {
    setAnchorEl(null);
  };

  const signOutUser = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        closeProfileMenu();
        nav("/");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const { user } = useContext(AuthenticatedUserContext);

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
      <div className="MainHeader">
        <Link to="/" style={{ textDecoration: "none" }}>
          <div className="LogoTitle">
            <img className="Logo" src={logo} alt="" />
            <p className="Title">הסעות מחוץ לחומות</p>
          </div>
        </Link>
        {user ? (
          <button className="HeaderButton" onClick={clickProfile}>
            <AccountCircleOutlinedIcon
              className="ProfileIcon"
              fontSize="large"
            />
            {user.displayName}
          </button>
        ) : (
          <button
            className="HeaderButton"
            onClick={() => {
              setSignInDialogOpen(true);
            }}
          >
            כניסה
          </button>
        )}
      </div>
      <p className="Subtitle">
        הסעות מתל אביב למשחקי הבית של הפועל ירושלים בארנה
      </p>
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
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={profileMenuOpen}
        onClose={closeProfileMenu}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={closeProfileMenu}>הגדרות (בקרוב!)</MenuItem>
        <MenuItem onClick={signOutUser}>התנתקות</MenuItem>
      </Menu>
    </div>
  );
}

export default Header;
