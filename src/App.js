import { Routes, Route } from "react-router-dom";
import { ColorModeContext, useMode } from "./theme"; /* import from theme.js*/
/*CssBaseline will reset our css to the default, and ThemeProvider- would provide us the ability to pass the themes in light/dark mode*/
import { CssBaseline, ThemeProvider } from "@mui/material";
import Topbar from "./scenes/global/topbar";
import Sideboard from "./scenes/global/sidebar";

//Import Components/other PAGES
import Login from "./scenes/login";
import ResetPassword from "./scenes/login/resetpassword.jsx";
import ForgetPassword from "./scenes/login/forgetpassword.jsx";

import Dashboard from "./scenes/dashboard"; //Dashboard
import Archiv from "./scenes/archiv"; // archiv Material UI
import Archivkendo from "./scenes/archivkendo"; //DATA GRID kENDO
import Schedule from "./scenes/schedule"; //CALENDAR
import Workflow from "./scenes/workflow"; //AUFGABE
//CHARTS AND GAUGES
import Areachart from "./scenes/areachart";
import Linechart from "./scenes/linechart";
import Piechart from "./scenes/piechart";
import Taskgauge from "./scenes/taskgauge";
//Open Positions (OP)*************
import Lieferantop from "./scenes/lieferantop";
import VerbindungDataGrid from "./scenes/lieferantop/verbindungDataGrid.jsx"
import Kundenop from "./scenes/kundenop";

//import context Provider
//import { useStateContext } from "./contexts/ContextProvider";

const App = () => {
  const [theme, colorMode] = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/forgot" element={<ForgetPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/*"
              element={
                <div className="dashboard-container">
                  <Sideboard />
                  {/* <div className="top-content"> */}
                  <Topbar />
                  <main className="content">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/archiv" element={<Archiv />} />
                      <Route path="/archivkendo" element={<Archivkendo />} />
                      {/* OPS */}
                      <Route path="/lieferantop" element={<Lieferantop />} />
                      <Route path="/verbindungDataGrid" element={<VerbindungDataGrid />} />
                      <Route path="/kundenop" element={<Kundenop />} />
                        {/* PAGES */}
                      <Route path="/schedule" element={<Schedule />} />
                      <Route path="/workflow" element={<Workflow />} />
                      {/* CHARTS */}
                      <Route path="/areachart" element={<Areachart />} />
                      <Route path="/linechart" element={<Linechart />} />
                      <Route path="/piechart" element={<Piechart />} />
                      <Route path="/taskgauge" element={<Taskgauge />} />

                    </Routes>
                  </main>
                  {/* </div> */}
                </div>
              }
            />
          </Routes>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
