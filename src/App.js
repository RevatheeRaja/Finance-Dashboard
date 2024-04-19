import { Routes, Route, Link } from "react-router-dom";
import { ColorModeContext, useMode } from "./theme"; /* import from theme.js*/
/*CssBaseline will reset our css to the default, and ThemeProvider- would provide us the ability to pass the themes in light/dark mode*/
import { CssBaseline, ThemeProvider } from "@mui/material";
import Topbar from "./scenes/global/topbar";
import Sideboard from "./scenes/global/sidebar";
//Import Components/other PAGES
import Dashboard from "./scenes/dashboard"; //Dashboard
import Archiv from "./scenes/archiv"; // archiv
import Kalendar from "./scenes/calendar";
import Schedule from "./scenes/schedule";
import Aufgabe from "./scenes/aufgabe";
import Workflow from "./scenes/workflow";
import { Kanban } from "@syncfusion/ej2-kanban";
// import Invoice from "./scenes/invoice";
// import Bar from "./scenes/bar";
// import Contacts from "./scenes/contacts";
// import Form from "./scenes/form";
// import Dashboard from "./scenes/dashboard";

function App() {
  const [theme, colorMode] = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sideboard />
          <main className="content">
            <Topbar />
            {/* ROUTES */}
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/archiv" element={<Archiv />} />
              <Route path="/calendar" element={<Kalendar />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/aufgabe" element={<Aufgabe />} />
              <Route path="/workflow" element={<Workflow />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
