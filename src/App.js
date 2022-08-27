import Home from "./home_page/Home";
import { AuthenticatedUserProvider } from "./UserProvider";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: ["Varela Round"].join(","),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthenticatedUserProvider>
        <Home />
      </AuthenticatedUserProvider>
    </ThemeProvider>
  );
}

export default App;
