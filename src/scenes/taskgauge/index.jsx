import React from 'react'
import { Box, useTheme } from "@mui/material";
import Header from "../../components/Headers";
import {ArcGauge} from '@progress/kendo-react-gauges';
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
    color: "#f31700",
  },
];

const Taskgauge = () => {
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    setInterval(() => {
      setValue(Math.ceil(Math.random() * 100));
    }, 1000);
  }, []);
  const arcOption = {
    value: value,
    colors,
  }
  const arcCenterRenderer = (value,color) =>{
    return(
      <h2 style={{color: color, fontSize: 20}}>{value} Task Pending</h2>
    )
  }
  return (
   <Box m = "20px">
        <Header  title="Arc Gauge"
          subtitle="Pending task"/>
    <ArcGauge {...arcOption} arcCenterRender={arcCenterRenderer}  />
   </Box>
  )
}

export default Taskgauge