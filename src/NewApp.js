import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useEffect } from "react";
import { FiSettings } from "react-icons/fi";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";

import Topbar from "./scenes/global/topbar";
import Sideboard from "./scenes/global/sidebar";
import Sideboardedited from "./scenes/global/sidebaredited";

//Import Components/other PAGES
import Login from "./scenes/login";
import Dashboard from "./scenes/dashboard"; //Dashboard
import Archiv from "./scenes/archiv"; // archiv
import Archivsyncfusion from "./scenes/archivsyncfusion"; // Datagrid using syncfusion
import Schedule from "./scenes/schedule";
import Aufgabe from "./scenes/aufgabe";
import Workflow from "./scenes/workflow";
import Charts from "./scenes/charts";
import Areachart from "./scenes/areaChart";

//import context Provider
import { useStateContext } from "./contexts/ContextProvider";
import "./App.css";
const App = () => {
  const {
    setCurrentColor,
    setCurrentMode,
    currentMode,
    activeMenu,
    currentColor,
    themeSettings,
    setThemeSettings,
  } = useStateContext();
  return (
    <div className="app flex relative dark:bg-main-dark-bg">
      <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
        <TooltipComponent content="Settings" position="Top">
          <button
            type="button"
            className="text-3xl text-white p-3 hover:drop-shadow-xl hover:bg-light-gray text-white"
            style={{ background: "blue", borderRadius: "50%" }}
          >
            <FiSettings />
          </button>
        </TooltipComponent>
      </div>
      {/*  {activeMenu ? (
        <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
          {" "}
          <Sideboard />
        </div>
      ) : (
        <div className="w-0 dark:bg-secondary-dark-bg">
          {" "}
          <Sideboard />
        </div>
      )}
      <div
        className={
          activeMenu
            ? "dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  "
            : "bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 "
        }
      >
        <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
          <Topbar />
        </div>
      </div> */}
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/*"
            element={
              <div
                className={`dashboard-container ${
                  activeMenu
                    ? "dark:bg-secondary-dark-bg bg-white"
                    : "w-0 dark:bg-secondary-dark-bg"
                }`}
              >
                <Sideboard />
                <div
                  className={`top-content dark:bg-main-bg bg-main-bg min-h-screen w-full`}
                >
                  <Topbar />
                  <main className="content">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/archiv" element={<Archiv />} />
                      <Route
                        path="/archivsyncfusion"
                        element={<Archivsyncfusion />}
                      />
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
    </div>
  );
};

export default App;
