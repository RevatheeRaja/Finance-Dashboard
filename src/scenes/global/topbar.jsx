import { Box, IconButton, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import logoLight from "../../assets/image/logo-light.png";
import logoDark from "../../assets/image/logo-dark.png";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

import Swal from "sweetalert2";
const Topbar = () => {
  const navigate = useNavigate();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [logoSrc, setLogoSrc] = useState(
    theme.palette.mode === "dark" ? logoDark : logoLight
  );
  const handleChange = async() => {

    const response = await fetch("https://fibutronwebapi.fibutron.de/api/account/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      // Email sent successfully, handle success
      Swal.fire({
        icon: "success",
        title: "logedout!",
        text: "Please check your email for further instructions.",
      });
      navigate('/')
    } else {
      // Email sending failed, handle error
      console.error("Failed to send reset password email.");
      Swal.fire({
        icon: "error",
        title: "failed to logout",
        text: "An error occurred while sending the reset password email.",
      });
    }
  };

  const handleToggleLogo = () => {
    const newLogoSrc = logoSrc === logoLight ? logoDark : logoLight;
    setLogoSrc(newLogoSrc);
  };

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      p={2}
      position="absolute"
      top={0}
      left={0}
      right= {100}
      
    >
      {/* Logo */}
      <IconButton>
        <img
          alt="logo"
          width="120px"
          height="auto"
          ml="5px"
          src={logoSrc}
          style={{ cursor: "pointer" }}
        />
      </IconButton>

      {/* SEARCH BAR */}
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      {/* ICONS */}
      <Box display="flex">
        <IconButton
          onClick={() => {
            colorMode.toggleColorMode();
            handleToggleLogo();
          }}
        >
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton>
        <Tooltip title="Logout" placement="top">
    <IconButton onClick={handleChange}>
        <RiLogoutCircleRLine />
    </IconButton>
</Tooltip>
          {/* <PersonOutlinedIcon /> */}
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
