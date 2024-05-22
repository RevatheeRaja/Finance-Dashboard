import * as React from "react";
import { Box, useTheme } from "@mui/material";
import Header from "../../components/Headers";
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
  exportVisual,
} from "@progress/kendo-react-charts";
import "hammerjs";
//the color palletes
import { tokens } from "../../theme";
//dummy data
import { lineChartData } from "../../data/mockLinechart";
const Linechart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { months, investment, profit } = lineChartData;
  const suffix = "k €";
  const labelContent = (e) => e.value + suffix;
  return (
    <Box m="20px">
      <Header title="Line Chart" subtitle="Investment vs Profit" />
      <Chart>
        <ChartTitle text="Investment vs Profit" />
        <ChartCategoryAxis>
          <ChartCategoryAxisItem
            title={{ text: "Months" }}
            categories={months}
          />
        </ChartCategoryAxis>
        <ChartValueAxis>
          <ChartValueAxisItem
            // color={`${theme.palette.mode === "dark" ? "white" : "#3d3d3d"}`}
            labels={{
              content: labelContent,
            //   color: `${theme.palette.mode === "dark" ? "white" : "#3d3d3d"}`,
            }}
          />
        </ChartValueAxis>
        <ChartSeries>
          <ChartSeriesItem type="line" dashType="solid" data={investment} />
          <ChartSeriesItem type="line" dashType="solid" data={profit} />
        </ChartSeries>
      </Chart>
    </Box>
  );
};
export default Linechart;
