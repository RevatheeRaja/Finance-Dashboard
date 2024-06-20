import * as React from "react";
import { Box, useTheme } from "@mui/material";
import Header from "../../components/Headers"; //TITLE AND SUBTITLE
/**********ESSENTIAL KENDO CHART COMPONNETS************ */
import {
  Chart,
  ChartArea,
  ChartTitle,
  ChartLegend,
  ChartSeries,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartValueAxis,
  ChartValueAxisItem,
  ChartAxisDefaults,
  exportVisual,
} from "@progress/kendo-react-charts";
import "hammerjs";
import { useLocation } from "react-router-dom";
/************ESSENTIAL KENDO CHART COMPONENTS ENDS******************** */
//the color palletes
import { tokens } from "../../theme";

/***********DUMMY DATA FOR TEST*************** */
import { lineChartData } from "../../data/mockLinechart";

const Linechart = () => {
  const location = useLocation();
  const standalone = location.pathname === "/linechart";
  //COLOR TOKENS AND THEME
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { months, investment, profit } = lineChartData;
  const suffix = "k €";
  const labelContent = (e) => e.value + suffix;
  return (
    <Box m="20px">
      {/* TITLE AND SUBTITLE */}

      {standalone && (
        <Header title="Line Chart" subtitle="Investment vs Profit" />
      )}
      <Chart pannable={true} zoomable={true} style={{ width: 400 }}>
        <ChartArea
          /* background={`${
            theme.palette.mode === "dark" ? "#121b68" : "#F5F5F5"
          }`} */
          opacity={0.5}
          margin={30}
        />
        <ChartTitle
          text="Investment vs Profit"
          // color={`${theme.palette.mode === "dark" ? "white" : "#3d3d3d"}`}
        />
        <ChartLegend
          position="bottom"
          orientation="horizontal"
          background="#F5F5F5"
        />
        <ChartCategoryAxis>
          <ChartCategoryAxisItem
            categories={months}
            // color={`${theme.palette.mode === "dark" ? "white" : "#3d3d3d"}`}
            title={{
              text: "Months",
              // color: `${theme.palette.mode === "dark" ? "white" : "#3d3d3d"}`,
            }}
          />
        </ChartCategoryAxis>
        <ChartValueAxis>
          <ChartValueAxisItem
            color={`${theme.palette.mode === "dark" ? "white" : "#3d3d3d"}`}
            labels={{
              content: labelContent,
              color:"#3d3d3d",
              // color: `${theme.palette.mode === "dark" ? "white" : "#3d3d3d"}`,
            }}
          />
        </ChartValueAxis>
        <ChartAxisDefaults
          labels={{
            format: "c0",
          }}
        />

        <ChartSeries>
          <ChartSeriesItem
            type="line"
            dashType="solid"
            name="Investment"
            data={investment}
            color={'#6EB5FF'}
            // color={`${theme.palette.mode === "dark" ? "#57DCBE" : "#6EB5FF"}`}
            opacity={100}
          />
          <ChartSeriesItem
            type="line"
            dashType="solid"
            name="Profit  "
            data={profit}
            // color={`${theme.palette.mode === "dark" ? "#C21B5B" : "#D5AAFF"}`}
            opacity={100}
          />
        </ChartSeries>
      </Chart>
    </Box>
  );
};
export default Linechart;
