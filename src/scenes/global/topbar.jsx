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


const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [logoSrc, setLogoSrc] = useState(
    theme.palette.mode === "dark" ? logoDark : logoLight
  );

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
        <RiLogoutCircleRLine />

          {/* <PersonOutlinedIcon /> */}
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
