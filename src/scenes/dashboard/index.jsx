import React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Typography,
  Modal,
  Grid,
  Card,
  CardContent,
  TextField,
  useTheme,
} from "@mui/material"; //for the add component funtion
import { useNavigate, useLocation } from "react-router-dom";
import { TileLayout } from "@progress/kendo-react-layout";
import Swal from "sweetalert2"; //ALERTS
/*****IMPORT ICONS***************** */
import AddIcon from "@mui/icons-material/Add";
import InventoryIcon from "@mui/icons-material/Inventory"; //Archiv
import BarChartIcon from "@mui/icons-material/BarChart";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
/*****IMPORT ICONS Ends***************** */
import Header from "../../components/Headers";
import { initialGroups } from "./initialGroup"; // import your initial data
/********IMPORT COMPONENTS************************ */
import LieferantopChart from "../lieferantop/lieferantopChart";
import KundenopChart from "../kundenop/kundenopChart";
import Linechart from "../linechart";
import Areachart from "../areachart";
import Piechart from "../piechart";
import Taskgauge from "../taskgauge";
import TodayMeeting from "../calendar/todayMeeting";
/********IMPORT COMPONENTS Ends************************ */
//the color palletes
import { tokens } from "../../theme";
/**** */
const Dashboard = () => {
  const [sessionId, setSessionId] = useState(""); // State to store session ID
  const navigate = useNavigate();
  const location = useLocation();
  const [showAddComponent, setShowAddComponent] = React.useState(null);
  const [groups, setGroups] = React.useState(initialGroups);
  const [editIndex, setEditIndex] = useState(null);
  const [editName, setEditName] = useState("");
  //COLOR TOKENS AND THEME
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  /*****************LOGOUT WITH SESSION TIMINGS************************ */
  useEffect(() => {
    const newSessionId = "random_session_id"; // Generate or retrieve session ID from server
    setSessionId(newSessionId);
    const handleLogout = () => {
      setSessionId(""); // Clear session ID
      Swal.fire({
        icon: "info",
        title: "Logged Out",
        text: "You have been logged out.",
      });
      navigate("/");
    };
    const logoutTimer = setTimeout(() => {
      handleLogout(); // Logout after the timeout
    }, 24 * 60 * 60 * 1000); // 24 hours  in milliseconds
    //7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds
    return () => clearTimeout(logoutTimer); // Cleanup timer on component unmount
  }, [navigate]);
  /*****************LOGOUT WITH SESSION TIMINGS ENDs************************ */
  /******************ADD NEW GROUP FOR DASHBOARD****************************************** */
  const handleAddGroup = () => {
    setGroups([
      ...groups,
      { name: `Group ${groups.length + 1}`, components: [] },
    ]);
  };

  const handleDeleteGroup = (groupIndex) => {
    setGroups(groups.filter((_, index) => index !== groupIndex));
  };

  const handleAddComponent = (groupIndex) => {
    setShowAddComponent(groupIndex);
  };

  const addComponentToGroup = (groupIndex, component) => {
    const newGroups = [...groups];
    newGroups[groupIndex].components.push(component);
    setGroups(newGroups);
    setShowAddComponent(null);
  };

  const handleComponentClick = (path) => {
    navigate(path);
  };

  const components = [
    { name: "Archiv", icon: <InventoryIcon />, path: "/archiv" },
    { name: "ArchivKendo", icon: <InventoryIcon />, path: "/archivkendo" },
    { name: "Kunden OP", icon: <PersonIcon />, path: "/kundenop" },
    { name: "Lieferant OP", icon: <BarChartIcon />, path: "/lieferantop" },

    // Add more components as needed
  ];
  const handleEditGroup = (groupIndex) => {
    setEditIndex(groupIndex);
    setEditName(groups[groupIndex].name);
  };

  const handleSaveEdit = (groupIndex) => {
    const newGroups = [...groups];
    newGroups[groupIndex].name = editName;
    setGroups(newGroups);
    setEditIndex(null);
    setEditName("");
  };
  /******************ADD NEW GROUP FOR DASHBOARD ENDS****************************************** */
  /*****************DASH BOARD TILE LAYOUT********************************* */
  /***********ROW OF 2******************************* */
  const [data, setData] = React.useState([
    {
      col: 1,
      colSpan: 1,
      rowSpan: 2,
    },
    {
      col: 2,
      colSpan: 1,
      rowSpan: 2,
    },
  ]);
  const tiles = [
    {
      header: "Kunden OP Transaktionsübersicht",
      body: <KundenopChart />,
      reorderable: true,
      onClick: () => navigate("/kundenop"), // Navigate to /lieferantop when clicked
    },
    {
      header: "Lieferant OP Transaktionsübersicht",
      body: <LieferantopChart />,
      reorderable: true,
      resizable: "vertical",
      onClick: () => navigate("/lieferantop"), // Navigate to /lieferantop when clicked
    },
  ];
  /***********END ROW OF 2******************************* */
  /***********ROW OF 3******************************* */
  const [data1, setData1] = React.useState([
    {
      col: 1,
      colSpan: 1,
      rowSpan: 2,
    },
    {
      col: 2,
      colSpan: 1,
      rowSpan: 2,
    },
    {
      col: 3,
      colSpan: 1,
      rowSpan: 2,
    },
  ]);
  const tiles1 = [
    {
      header: "Income vs Expenditure",
      body: <Areachart />,
      reorderable: true,
      resizable: "vertical",
      onClick: () => navigate("/areachart"),
    },
    {
      header: "Investment vs Profit",
      body: <Linechart standalone={location.pathname === "/linechart"} />,
      reorderable: true,
      resizable: "vertical",
      onClick: () => navigate("/linechart"), // Navigate to /lieferantop when clicked
    },
    {
      header: "Financial Distribution",
      body: <Piechart standalone={location.pathname === "/piechart"} />,
      reorderable: true,
      resizable: "vertical",
      onClick: () => navigate("/piechart"), // Navigate to /lieferantop when clicked
    },
  ];
  /***********END ROW OF 3******************************* */
  /***********ROW OF 4******************************* */
  const [data2, setData2] = React.useState([
    {
      col: 1,
      colSpan: 1,
      rowSpan: 1,
    },
    {
      col: 2,
      colSpan: 1,
      rowSpan: 1,
    },
    {
      col: 3,
      colSpan: 1,
      rowSpan: 1,
    },
    {
      col: 4,
      colSpan: 1,
      rowSpan: 1,
    },
  ]);
  const tiles2 = [
    {
      header: "Today's Meetings",
      body: <TodayMeeting />,
      reorderable: true,
      resizable: "vertical",
      onClick: () => navigate("/calendar"),
    },
    {
      header: "Opex Ration",
      body: <Taskgauge standalone={location.pathname === "/taskgauge"} />,
      reorderable: true,
      resizable: "vertical",
      onClick: () => navigate("/taskgauge"), // Navigate to /lieferantop when clicked
    },
    {
      header: "Gross Profit",
      body: <Taskgauge standalone={location.pathname === "/taskgauge"} />,
      reorderable: true,
      resizable: "vertical",
      onClick: () => navigate("/taskgauge"),
    },
    {
      header: "Opex Ration",
      body: <Taskgauge standalone={location.pathname === "/taskgauge"} />,
      reorderable: true,
      resizable: "vertical",
      onClick: () => navigate("/taskgauge"), // Navigate to /lieferantop when clicked
    },
  ];
  /***********END ROW OF 4******************************* */
  /*****************DASH BOARD TILE LAYOUT ENDS********************************* */

  return (
    <Box>
      <Box>
        <Header
          title="DASHBOARD"
          subtitle="Herzlich willkommen bei FiBuTronic. Guten Tag!"
        />
        {/********** ADD BUTTON AND RELATED GROUP *************/}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <IconButton onClick={handleAddGroup}>
            <AddIcon />
          </IconButton>
        </Box>
        <Box ml={2}>
          <Grid container spacing={2} marginBottom={10}>
            {groups.map((group, groupIndex) => (
              <Grid item xs={12} sm={6} md={4} key={groupIndex}>
                <Card
                  sx={{
                    bgcolor:
                      theme.palette.mode === "dark" ? "#0d123d" : "#fcfcfc",
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      {/* Show input field if editing, else show group name */}
                      {editIndex === groupIndex ? (
                        <TextField
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          variant="outlined"
                          size="small"
                        />
                      ) : (
                        <Typography variant="h6">{group.name}</Typography>
                      )}
                      <Box>
                        {/* Show save button if editing, else show edit button */}
                        {editIndex === groupIndex ? (
                          <IconButton
                            onClick={() => handleSaveEdit(groupIndex)}
                          >
                            <SaveIcon />
                          </IconButton>
                        ) : (
                          <IconButton
                            onClick={() => handleEditGroup(groupIndex)}
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                        <IconButton
                          onClick={() => handleAddComponent(groupIndex)}
                        >
                          <AddIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteGroup(groupIndex)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {group.components.map((component, compIndex) => (
                        <Box
                          key={compIndex}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                          onClick={() => handleComponentClick(component.path)}
                        >
                          {component.icon}
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {component.name}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        {/* Modal for adding components */}
        <Modal
          open={showAddComponent !== null}
          onClose={() => setShowAddComponent(null)}
          aria-labelledby="add-component-modal"
          aria-describedby="add-component-to-group"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" mb={2}>
              Add Component
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {components.map((component, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    addComponentToGroup(showAddComponent, component)
                  }
                >
                  {component.icon}
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {component.name}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Modal>
        {/********** END ADD BUTTON AND RELATED GROUP *************/}

        {/********** TILE LAYOUT *************/}
        <Box m={2}>
          {/* ROW OF 4 */}
          <TileLayout
            columns={4}
            rowHeight={320}
            // columnWidth={560}
            gap={{
              rows: 10,
              columns: 10,
            }}
            positions={data2}
            items={tiles2.map((tile, index) => ({
              ...tile,
              body: (
                <div
                  onClick={tile.onClick}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {tile.body}
                </div>
              ),
            }))}
          />
          {/* END ROW OF 4 */}
          {/* ROW OF 3 */}
          <TileLayout
            columns={3}
            rowHeight={260}
            columnWidth={560}
            gap={{
              rows: 10,
              columns: 10,
            }}
            positions={data1}
            items={tiles1.map((tile, index) => ({
              ...tile,
              body: (
                <div onClick={tile.onClick} style={{ cursor: "pointer" }}>
                  {tile.body}
                </div>
              ),
            }))}
          />
          {/* END ROW OF 3 */}
          {/* ROW OF 2 */}
          <TileLayout
            columns={2}
            rowHeight={255}
            positions={data}
            gap={{
              rows: 12,
              columns: 12,
            }}
            items={tiles.map((tile, index) => ({
              ...tile,
              body: (
                <div onClick={tile.onClick} style={{ cursor: "pointer" }}>
                  {tile.body}
                </div>
              ),
            }))}
          />
          {/*END ROW OF 2 */}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
