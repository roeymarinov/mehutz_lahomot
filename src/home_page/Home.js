import "../utils/styles.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import {
  query,
  where,
  orderBy,
  collection,
  getDocs,
  Timestamp,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import { AuthenticatedUserContext } from "../utils/UserProvider";
import dayjs from "dayjs";

import eilatLogo from "../assets/logo_eilat.png";
import beerShevaLogo from "../assets/logo_beer_sheva.png";
import gilboaGalilLogo from "../assets/logo_gilboa_galil.png";
import galilElionLogo from "../assets/logo_galil_elion.png";
import haifaLogo from "../assets/logo_haifa.png";
import hapoelTlvLogo from "../assets/logo_hapoel_tlv.png";
import hertzeliyaLogo from "../assets/logo_hertzeliya.png";
import holonLogo from "../assets/logo_holon.png";
import kiryatAtaLogo from "../assets/logo_kiryat_ata.png";
import maccabiTlvLogo from "../assets/logo_maccabi_tlv.png";
import nesZionaLogo from "../assets/logo_nes_ziona.png";
import ludwigsburgLogo from "../assets/logo_ludwigsburg.png";
import darussafakaLogo from "../assets/logo_darussafaka.png";
import bakkenLogo from "../assets/logo_bakken.png";
import googleMaps from "../assets/google_maps.png";
import waze from "../assets/waze.png";
import facebook from "../assets/facebook.png";
import whatsapp from "../assets/whatsapp.png";
import { CircularProgress, Dialog } from "@mui/material";

function Home({
  signInDialogOpen,
  setSignInDialogOpen,
  signUpDialogOpen,
  setSignUpDialogOpen,
}) {
  // const [displayAsAdmin, setDisplayAsAdmin] = useState(false);
  const [notSignedDialogOpen, setNotSignedDialogOpen] = useState(false);
  const { user } = useContext(AuthenticatedUserContext);
  const [buses, setBuses] = useState([]);
  const navigate = useNavigate();
  // if (user) {
  //     const docRef = doc(db, "Users", user.uid);
  //     getDoc(docRef).then((docSnap) => {
  //         if (docSnap.exists()) {
  //             setDisplayAsAdmin(docSnap.data().admin);
  //         } else {
  //             // doc.data() will be undefined in this case
  //             console.log("No such document!");
  //         }
  //     });
  // }
  const timeToString = (date) => {
    return (
      date.toDate().getHours() +
      ":" +
      date.toDate().getMinutes().toString().padStart(2, "0")
    );
  };

  const [displayAsAdmin, setDisplayAsAdmin] = useState(false);
  const [deleteBusDialogOpen, setDeleteBusDialogOpen] = useState(false);
  const [loadingBuses, setLoadingBuses] = useState(true);
  const BusesRef = collection(db, "Buses");
  const nowDate = Timestamp.now().toDate();
  nowDate.setHours(0, 0, 0, 0);
  const nowStamp = Timestamp.fromDate(nowDate);
  const q = query(BusesRef, where("date", ">", nowStamp), orderBy("date"));
  useEffect(() => {
    if (user) {
      setDisplayAsAdmin(user.displayAsAdmin);
    }
    getDocs(q).then((querySnapshot) => {
      const busesArray = [];
      querySnapshot.forEach((doc) => {
        const busID = doc.id;
        const data = doc.data();
        const opponentName = data.opponent;
        const maxPassengers = data.max_passengers;
        const busTimeDayjs = dayjs(data.bus_time.toDate());
        const mahirTime = busTimeDayjs.add(15, "m");
        const latrunTime = busTimeDayjs.add(35, "m");
        const gameTime = timeToString(data.game_time);
        const busTime = {
          merkaz: timeToString(data.bus_time),
          mahir: timeToString(mahirTime),
          latrun: timeToString(latrunTime),
        };
        const gameDate =
          data.date.toDate().getDate() +
          "/" +
          (parseInt(data.date.toDate().getMonth()) + 1).toString();
        const gameDay = data.date.toDate().getDay();
        const isBusFull = data.total_passengers >= data.max_passengers;
        let isUserRegistered = false;

        if (user) {
          const registeredUsers = data.registered_users;
          isUserRegistered =
            registeredUsers[user.email.replaceAll(".", "@")] !== undefined;
        }
        busesArray.push({
          opponentName: opponentName,
          maxPassengers: maxPassengers,
          gameDate: gameDate,
          gameTime: gameTime,
          gameDay: gameDay,
          busTime: busTime,
          busID: busID,
          isBusFull: isBusFull,
          isUserRegistered: isUserRegistered,
        });
      });
      setBuses(busesArray);
      setLoadingBuses(false);
    });
  }, [user]);

  const convertNumToDayOfWeek = (num) => {
    switch (num) {
      case 0:
        return "?????? ??????????";
      case 1:
        return "?????? ??????";
      case 2:
        return "?????? ??????????";
      case 3:
        return "?????? ??????????";
      case 4:
        return "?????? ??????????";
      case 5:
        return "?????? ????????";
      case 6:
        return "?????? ??????";
      default:
        return "error";
    }
  };

  const convertNameToLogo = (name) => {
    switch (name) {
      case "?????????? ????????":
        return eilatLogo;
      case "?????????? ?????? ??????":
        return beerShevaLogo;
      case "?????????? ?????????? ????????":
        return gilboaGalilLogo;
      case "?????????? ???????? ??????????":
        return galilElionLogo;
      case "?????????? ????????":
        return haifaLogo;
      case "?????????? ???? ????????":
        return hapoelTlvLogo;
      case "?????? ????????????":
        return hertzeliyaLogo;
      case "?????????? ??????????":
        return holonLogo;
      case "???????????? ???????? ??????":
        return kiryatAtaLogo;
      case "???????? ???? ????????":
        return maccabiTlvLogo;
      case "???????????? ???? ??????????":
        return nesZionaLogo;
      case "????????????????????????":
        return ludwigsburgLogo;
      case "????????????????":
        return darussafakaLogo;
      case "????????":
        return bakkenLogo;
      default:
        return "error";
    }
  };

  return (
    <div className="Home">
      <p className="ContentSubtitle">?????????? ????????????:</p>
      {loadingBuses && <CircularProgress className={"LoadingBuses"} />}
      {buses.length > 0 && (
        <div className="GameCard">
          <div className="LogoInfo">
            <img
              className="OpponentLogo"
              src={convertNameToLogo(buses[0].opponentName)}
              alt="opponent logo"
            />

            <div className="GameInfo">
              <h3 className="OpponentName">{buses[0].opponentName}</h3>
              <p>
                {convertNumToDayOfWeek(buses[0].gameDay)} {buses[0].gameDate}
              </p>
              <p>????????: {buses[0].gameTime}</p>
              <p>????????: {buses[0].busTime.merkaz}</p>
              <p>?????? ????????</p>
              {displayAsAdmin && <p>??????' ????????????: {buses[0].maxPassengers}</p>}
              <a
                href={"https://tickets.hapoel.co.il/"}
                target="_blank"
                rel="noopener noreferrer"
                className={"TicketsLink"}
              >
                ?????????????? ??????????
              </a>
            </div>
          </div>
          <button
            className="RegisterButton"
            disabled={buses[0].isBusFull}
            onClick={() => {
              if (user) {
                navigate("/bus", { state: buses[0] });
              } else {
                setNotSignedDialogOpen(true);
              }
            }}
          >
            {" "}
            {buses[0].isUserRegistered
              ? "?????????? ??????????"
              : buses[0].isBusFull
              ? "?????????? ????????"
              : "???????????? ????????????"}
          </button>
          {displayAsAdmin && (
            <button className="RegisterButton" onClick={() => {}}>
              ?????????? ????????
            </button>
          )}
          {displayAsAdmin && (
            <button
              className="RegisterButton"
              onClick={() => {
                setDeleteBusDialogOpen(true);
              }}
            >
              ?????????? ????????
            </button>
          )}
        </div>
      )}
      {displayAsAdmin && (
        <DeleteBusDialog
          open={deleteBusDialogOpen}
          setOpen={setDeleteBusDialogOpen}
          bus={buses[0]}
        />
      )}
      {displayAsAdmin && <p className="ContentSubtitle">?????????? ????????????:</p>}
      {displayAsAdmin &&
        buses.length > 1 &&
        buses.slice(1).map((bus, index) => {
          index = index + 1;
          return (
            <div className="GameCard" key={index}>
              <div className="LogoInfo">
                <img
                  className="OpponentLogo"
                  src={convertNameToLogo(buses[index].opponentName)}
                  alt="opponent logo"
                />

                <div className="GameInfo">
                  <h3 className="OpponentName">{buses[index].opponentName}</h3>
                  <p>
                    {convertNumToDayOfWeek(buses[index].gameDay)}{" "}
                    {buses[index].gameDate}
                  </p>
                  <p>????????: {buses[index].gameTime}</p>
                  <p>????????: {buses[index].busTime.merkaz}</p>
                  <p>?????? ????????</p>
                  {displayAsAdmin && (
                    <p>??????' ????????????: {buses[index].maxPassengers}</p>
                  )}
                  <a
                    href={"https://tickets.hapoel.co.il/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={"TicketsLink"}
                  >
                    ?????????????? ??????????
                  </a>
                </div>
              </div>
              <button
                className="RegisterButton"
                disabled={buses[index].isBusFull}
                onClick={() => {
                  if (user) {
                    navigate("/bus", { state: buses[index] });
                  } else {
                    setNotSignedDialogOpen(true);
                  }
                }}
              >
                {" "}
                {buses[index].isUserRegistered
                  ? "?????????? ??????????"
                  : buses[index].isBusFull
                  ? "?????????? ????????"
                  : "???????????? ????????????"}
              </button>
              {displayAsAdmin && (
                <button className="RegisterButton" onClick={() => {}}>
                  ?????????? ????????
                </button>
              )}
              {displayAsAdmin && (
                <button
                  className="RegisterButton"
                  onClick={() => {
                    setDeleteBusDialogOpen(true);
                  }}
                >
                  ?????????? ????????
                </button>
              )}
              {displayAsAdmin && (
                <DeleteBusDialog
                  open={deleteBusDialogOpen}
                  setOpen={setDeleteBusDialogOpen}
                  bus={buses[index]}
                />
              )}
            </div>
          );
        })}

      {displayAsAdmin && (
        <Link className="RegisterButtonLink" to="add_bus">
          <button className="RegisterButton">?????????? ????????</button>
        </Link>
      )}
      <a
        className="FacebookButton"
        href={"https://chat.whatsapp.com/Jl6sAaAGbTE4MYUc6nCvgy"}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={whatsapp} alt={"facebook logo"} />
        <div>???????????? ????????????????</div>
      </a>
      <a
        className="FacebookButton"
        href={"https://www.facebook.com/groups/146607822184153"}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={facebook} alt={"facebook logo"} />
        <div>???????????? ????????????????</div>
      </a>
      <a
        className="FacebookButton"
        href={"https://www.facebook.com/mehutz.la"}
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src={facebook} alt={"facebook logo"} />
        <div>?????? ????????????????</div>
      </a>

      <p className="ContentSubtitle">??????????:</p>
      <div className="GameCard">
        <ul>
          <li>
            <div className={"StationInfo"}>
              <p>???????? ????????</p>

              <div className="NavigationLogoLinks">
                <a
                  href={
                    "https://www.google.com/maps/place/32%C2%B004'57.3%22N+34%C2%B047'49.3%22E/@32.0825762,34.7948253,17z/data=!3m1!4b1!4m5!3m4!1s0x0:0x5b1fe893dfd911a3!8m2!3d32.0825762!4d34.797014"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={googleMaps} alt={""} className="NavigationLogo" />
                </a>
                <a
                  href={"https://waze.com/ul/hsv8wxb6kg"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={waze} alt={""} className="NavigationLogo" />
                </a>
              </div>
            </div>
          </li>
          <li>
            <div className={"StationInfo"}>
              <p>?????????? ???????????? - ?????????? ??????????</p>

              <div className="NavigationLogoLinks">
                <a
                  href={"https://maps.app.goo.gl/uH6yxTU5ZQRzWCj98"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={googleMaps} alt={""} className="NavigationLogo" />
                </a>
                <a
                  href={"https://waze.com/ul/hsv8y0cshq"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={waze} alt={""} className="NavigationLogo" />
                </a>
              </div>
            </div>
          </li>
          <li>
            <div className={"StationInfo"}>
              <p>???????? ??????????</p>
              <div className="NavigationLogoLinks">
                <a
                  href={"https://goo.gl/maps/kjvFeacqo4zjmPn48"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={googleMaps} alt={""} className="NavigationLogo" />
                </a>
                <a
                  href={"https://waze.com/ul/hsv8v5gwh6"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={waze} alt={""} className="NavigationLogo" />
                </a>
              </div>
            </div>
          </li>
          <li>
            <div className={"StationInfo"}>
              <p>?????? ????????</p>

              <div className="NavigationLogoLinks">
                <a
                  href={"https://goo.gl/maps/SmQ2Lhx7aAcRqUmWA"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={googleMaps} alt={""} className="NavigationLogo" />
                </a>
                <a
                  href={"https://waze.com/ul/hsv9h8u504"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={waze} alt={""} className="NavigationLogo" />
                </a>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <p className="ContentSubtitle">????????????:</p>
      <div className="GameCard">
        <ul className={"PriceList"}>
          <li>?????????? ?????? - ???20</li>
          <li>?????????? ?????? (???????? ??????????) - ???15</li>
          <li>???????? ???????? - ???330</li>
        </ul>
        <a
          href={
            "https://docs.google.com/forms/d/1e59PSkYThOuOUENK7i75eNLVGsZzMWUZPMGeQPX5XY8/viewform?edit_requested=true"
          }
          target="_blank"
          rel="noopener noreferrer"
          className={"MemberLink"}
        >
          ???????????? ????????
        </a>
      </div>
      <Dialog
        open={notSignedDialogOpen}
        onClose={() => setNotSignedDialogOpen(false)}
      >
        <div className={"NotSignedDialog"}>
          <p className={"SignUpInfo"}>
            ???? ?????? ???????????? ??????????, ???????? ?????????? ?????????????? ???????? ????????
          </p>
          <button
            className="RegisterButton"
            onClick={() => {
              setNotSignedDialogOpen(false);
              setSignInDialogOpen(true);
            }}
          >
            ????????????????
          </button>
        </div>
      </Dialog>
    </div>
  );
}
function DeleteBusDialog({ open, setOpen, bus }) {
  const [deleteSuccessDialogOpen, setDeleteSuccessDialogOpen] = useState(false);

  async function deleteBus(bus) {
    await deleteDoc(doc(db, "Buses", bus.busID));
  }

  return (
    <div>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <div className={"NotSignedDialog"}>
          <p className={"SignUpInfo"}>
            ?????? ?????? ???????????? ???????????????? ?????????? ???? ??????????? ???? ???????? ???????? ?????????? ????
          </p>
          <div className={"ConfirmCancel"}>
            <button
              className="SubmitButton"
              onClick={() => {
                deleteBus(bus).then(() => {
                  setOpen(false);
                  setDeleteSuccessDialogOpen(true);
                });
              }}
            >
              ??????????
            </button>
            <button
              className="SubmitButton"
              onClick={() => {
                setOpen(false);
              }}
            >
              ????????
            </button>
          </div>
        </div>
      </Dialog>
      <Dialog
        open={deleteSuccessDialogOpen}
        onClose={() => setDeleteSuccessDialogOpen(false)}
      >
        <div className="SubmitDialog">
          <p className="SuccessMessage">?????????? ?????????? ????????????! </p>
          <button
            className="SubmitButton"
            onClick={() => {
              setDeleteSuccessDialogOpen(false);
              window.location.reload();
            }}
          >
            ???????? ????????
          </button>
        </div>
      </Dialog>
    </div>
  );
}
export default Home;
