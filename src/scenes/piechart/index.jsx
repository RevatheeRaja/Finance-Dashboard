import * as React from "react";
import { Box, useTheme } from "@mui/material";
import Header from "../../components/Headers"; //TITLE AND SUBTITLE
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
      color: '#34eb3a'
    },
    {
      category: "Inventory cost",
      value: 0.1552,
      color: '#FF6600'
    },
    {
      category: "HR Department",
      value: 0.2059,
      color: '#3366FF'
    },
    {
      category: "IT-Department",
      value: 0.0911,
      color: '#34eb3a'
    },
    {
      category: "Marketing",
      value: 0.0933,
      color: '#668CFF'
    },
    {
        category: "Equipment Maintenance",
        value: 0.1933,
        color: '#FFCC00'
      },
      {
        category: "Legal Department",
        value: 0.3233,
        color: '#5cf065'
      },
  ];
const labelContent = (props) => {
    let formatedNumber = Number(props.dataItem.value).toLocaleString(undefined, {
      style: "percent",
      minimumFractionDigits: 2,
    });
    return `${props.dataItem.category}: ${formatedNumber}`;
  };
const Piechart = () => {
  return (
    <Box m="20px">
      {/* TITLE AND SUBTITLE */}
      <Header
        title="Pie Chart"
        subtitle="Financial Distribution across different department"
      />
      <Chart>
        <ChartTitle text="Financial Distribution across different department" />
        <ChartLegend position="bottom" />
        <ChartSeries>
          <ChartSeriesItem
            type="pie"
            data={series}
            field="value"
            categoryField="category"
            colorField = "color"
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
