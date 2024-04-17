import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
const Header = ({title,subtitle}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box mb="30px">
      <Typography
        variant="h3"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ m: '5px 10px 5px 10px' }}
      >
        {title}
      </Typography>
      <Typography
        variant="h5"
        color={colors.greenAccent[400]}
        fontWeight="bold"
        sx={{ m: '5px 10px 5px 10px'  }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
