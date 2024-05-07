import { Routes, Route, Link } from "react-router-dom";
import { ColorModeContext, useMode } from "./theme"; /* import from theme.js*/
/*CssBaseline will reset our css to the default, and ThemeProvider- would provide us the ability to pass the themes in light/dark mode*/
import { CssBaseline, ThemeProvider } from "@mui/material";
import Topbar from "./scenes/global/topbar";
import Sideboard from "./scenes/global/sidebar"; 

//Import Components/other PAGES
import Login from "./scenes/login"
import Dashboard from "./scenes/dashboard"; //Dashboard
import Archiv from "./scenes/archiv"; // archiv
import Archivsyncfusion from "./scenes/archivsyncfusion"; // Datagrid using syncfusion
import Schedule from "./scenes/schedule";
import Aufgabe from "./scenes/aufgabe";
import Workflow from "./scenes/workflow";
import Charts from "./scenes/charts";
import Areachart from "./scenes/areaChart";
import Mainpage from "./scenes/global/mainpage";
import ForgetPassword from "./scenes/login/forgetpassword.jsx"
 
function App() {
  const [theme, colorMode] = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/forgot" element={<ForgetPassword />} />

            <Route
              path="/*"
              element={
                <div className="dashboard-container">
                  <Sideboard />
                  <div className="top-content">
                    <Topbar />
                    <main className="content">
                      <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/archiv" element={<Archiv />} />
                        <Route path="/archivsyncfusion" element={<Archivsyncfusion />} />

                        <Route path="/schedule" element={<Schedule />} />
                        <Route path="/aufgabe" element={<Aufgabe />} />
                        <Route path="/workflow" element={<Workflow />} />
                        <Route path="/charts" element={<Charts />} />
                        <Route path="/areachart" element={<Areachart />} />
                      </Routes>
                    </main>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
