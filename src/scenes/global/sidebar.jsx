import { useState } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
//import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
//import Logo

//IMPORTING NECESSARY ICONSs
import HomeIcon from "@mui/icons-material/Home"; //Home
import InventoryIcon from "@mui/icons-material/Inventory"; //Archiv
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth"; //Calendar
import AssignmentIcon from "@mui/icons-material/Assignment";
import HelpIcon from "@mui/icons-material/Help"; //Support Center
import BarChartIcon from "@mui/icons-material/BarChart"; // Statistics
import MenuIcon from "@mui/icons-material/Menu";
import TimelineIcon from '@mui/icons-material/Timeline';
import SsidChartIcon from '@mui/icons-material/SsidChart';

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Link to={to} style={{ textDecoration: 'none'}}>
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[300],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    
    >
      <Typography>{title}</Typography>
      {/* <Link to={to} /> */}
    </MenuItem>
    </Link>
  );
};

const Sideboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box
      backgroundColor={colors.primary[400]}
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: `${colors.primary[900]} !important`,
          backgroundColor: `${colors.blueAccent[200]} !important`,
        },
        "& .pro-menu-item": {
          color: `${colors.grey[400]} !important`, // Default text color for menu items
        },
        "& .pro-menu-item:hover": {
          color:`${colors.greenAccent[800]} !important`, 
          backgroundColor: `${colors.redAccent[100]} !important`, 
        },
        "& .pro-menu-item.active": {
          color:`${colors.redAccent[800]} !important`, 
          backgroundColor: `${colors.greenAccent[100]} !important`, 
        },
      }}
    >
      <Sidebar collapsed={isCollapsed}  backgroundColor={colors.indigo[100]}>
      
        
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                {/* <img
                  alt="logo"
                  width="120px"
                  height="auto"
                  ml="5px"
                  src={`${process.env.PUBLIC_URL}/assets/image/logo.png`}
                  style={{ cursor: "pointer" }}
                /> */}

                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              {
                <Box display="flex" justifyContent="center" alignItems="center">
                  <img
                    alt="profile-user"
                    width="100px"
                    height="100px"
                    src={`${process.env.PUBLIC_URL}/assets/image/profilePicture.jpg`}
                    style={{ cursor: "pointer", borderRadius: "50%" }}
                  />
                </Box>
              }
              <Box textAlign="center">
                <Typography
                  variant="h3"
                  color={colors.blueAccent[500]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  Leon Mustermann
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  Finance Admin
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeIcon  />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h5"
              color={colors.blueAccent[500]}
              fontWeight="bold"
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography>
            <Item
              title="Archiv"
              to="/archiv"
              icon={<InventoryIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="ArchivSyncFusion"
              to="/archivsyncfusion"
              icon={<InventoryIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="ArchivKendo"
              to="/archivkendo"
              icon={<InventoryIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.blueAccent[500]}
              fontWeight="bold"
              sx={{ m: "15px 0 5px 20px" }}
            >
              Pages
            </Typography>
            <Item
              title="Calendar"
              to="/calendar"
              icon={<CalendarMonthIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Schedule"
              to="/schedule"
              icon={<CalendarMonthIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Aufgabe"
              to="/aufgabe"
              icon={<AssignmentIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Workflow"
              to="/workflow"
              icon={<AssignmentIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.blueAccent[500]}
              fontWeight="bold"
              sx={{ m: "15px 0 5px 20px" }}
            >
              Charts
            </Typography>
            <Item
              title="Line Chart"
              to="/charts"
              icon={<TimelineIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Area Chart"
              to="/areachart"
              icon={<SsidChartIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="FAQs"
              to="/faq"
              icon={<HelpIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default Sideboard;
