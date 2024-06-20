import * as React from "react";
import { Box, useTheme } from "@mui/material";
import Header from "../../components/Headers"; //TITLE AND SUBTITLE
import { useLocation } from "react-router-dom";
/**********ESSENTIAL KENDO CHART COMPONNETS************ */
import {
  Chart,
  ChartLegend,
  ChartSeries,
  ChartSeriesItem,
  ChartTitle,
} from "@progress/kendo-react-charts";
import "hammerjs";
/************ESSENTIAL KENDO CHART COMPONENTS ENDS******************** */
const series = [
  {
    category: "Rent",
    value: 0.2545,
    color: "#34eb3a",
  },
  {
    category: "Inventory cost",
    value: 0.1552,
    color: "#FF6600",
  },
  {
    category: "HR Department",
    value: 0.2059,
    color: "#3366FF",
  },
  {
    category: "IT-Department",
    value: 0.0911,
    color: "#34eb3a",
  },
  {
    category: "Maintenance",
    value: 0.0933,
    color: "#668CFF",
  },
  {
    category: "Marketing",
    value: 0.1933,
    color: "#FFCC00",
  },
  {
    category: "Legal Department",
    value: 0.3233,
    color: "#5cf065",
  },
];
const labelContent = (props) => {
  let formatedNumber = Number(props.dataItem.value).toLocaleString(undefined, {
    style: "percent",
    minimumFractionDigits: 2,
  });
  return `${props.dataItem.category}`;
};
const Piechart = () => {
  const location = useLocation();
  const standalone = location.pathname === "/piechart";
  return (
    <Box m="20px">
      {/* TITLE AND SUBTITLE */}
      {standalone && (
        <Header
        title="Pie Chart"
        subtitle="Financial Distribution across different department"
      />
      )}
      
      <Chart style={standalone ? { width: 750 } : {width: 450}}>
        <ChartTitle text="Financial Distribution across different department" />
        <ChartLegend position="bottom" />
        <ChartSeries>
          <ChartSeriesItem
            type="pie"
            data={series}
            field="value"
            categoryField="category"
            colorField="color"
            labels={{
              visible: true,
              content: labelContent,
            }}
          />
        </ChartSeries>
      </Chart>
    </Box>
  );
};
export default Piechart;
