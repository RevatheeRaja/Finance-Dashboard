import React from 'react'
import { Box, useTheme } from "@mui/material";
import Header from "../../components/Headers";
import {ArcGauge} from '@progress/kendo-react-gauges';
import { useLocation } from "react-router-dom";
import "hammerjs";
const colors  = [
  {
    to: 25,
    color: "#0058e9",
  },
  {
    from: 25,
    to: 50,
    color: "#37b400",
  },
  {
    from: 50,
    to: 75,
    color: "#ffc000",
  },
  {
    from: 75,
    color: "#0058e9",
  },
];

const Taskgauge = () => {
  const location = useLocation();
  const standalone = location.pathname === "/taskgauge";
  /* const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    setInterval(() => {
      setValue(Math.ceil(Math.random() * 100));
    }, 1000);
  }, []); */
  const arcOption = {
    value: 95,
    colors,
  }
  const arcCenterRenderer = (value,color) =>{
    return(
      <h2 style={{color: color, fontSize: 20}}>{value}% </h2>
    )
  }
  return (
   <Box m = "20px">
          {standalone && (
        <Header title="Arc Gauge" subtitle="Pending task"/>
      )}
    <ArcGauge  {...arcOption} arcCenterRender={arcCenterRenderer} style={{ width: 200 }} />
   </Box>
  )
}

export default Taskgauge
