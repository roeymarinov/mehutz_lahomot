import Home from "./home_page/Home";
import { AuthenticatedUserProvider } from "./utils/UserProvider";
import { createTheme, ThemeProvider } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./header/Header";
import BusRegister from "./bus_register/BusRegister";

const theme = createTheme({
  typography: {
    fontFamily: ["Varela Round"].join(","),
  },
  direction: "rtl",
  palette: {
    primary: {
      main: "#000000",
    },
    neutral: {
      main: "#df1d22",
    },
  },
});

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <AuthenticatedUserProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="bus" element={<BusRegister />} />
          </Routes>
        </AuthenticatedUserProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
