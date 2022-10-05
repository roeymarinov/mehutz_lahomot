import Home from "./home_page/Home";
import { AuthenticatedUserProvider } from "./utils/UserProvider";
import { createTheme, ThemeProvider } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./header/Header";
import BusRegister from "./bus_register/BusRegister";
import AddBus from "./add_bus/AddBus";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const theme = createTheme({
  typography: {
    fontFamily: ["Varela Round"].join(","),
  },
  direction: "rtl",
  palette: {
    primary: {
      main: "#000000",
    },
    // secondary: {
    //   main: "",
    // },
    neutral: {
      main: "#df1d22",
    },
    info: {
      main: "#FFFFFF",
    },
  },
});

function App() {
  return (
    <LocalizationProvider
      //adapterLocale="he"
      // localeText={{ locale: "he" }}
      dateAdapter={AdapterDayjs}
    >
      <Router>
        <ThemeProvider theme={theme}>
          <AuthenticatedUserProvider>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="bus" element={<BusRegister />} />
              <Route path="add_bus" element={<AddBus />} />
            </Routes>
          </AuthenticatedUserProvider>
        </ThemeProvider>
      </Router>
    </LocalizationProvider>
  );
}

export default App;
