import React from "react";
import { sumBetrag, sumBankeinzuge } from "./calculatePayments";
import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartCategoryAxisTitle,
  ChartCategoryAxisItem,
} from "@progress/kendo-react-charts";
import "hammerjs";
import { green } from "@mui/material/colors";

const bankBalance = 3000;
const categories = ["Balance", "Betrag", "Bankeinzuge"];
const colors = ["#4caf50", "#2196f3", "#ff9800"]; // Example colors for each bar
const LieferantopChart = () => {
  return (
    <Chart>
      <ChartCategoryAxis>
        <ChartCategoryAxisItem categories={categories}></ChartCategoryAxisItem>
      </ChartCategoryAxis>
      <ChartSeries>
        <ChartSeriesItem
          type="column"
          data={[bankBalance, sumBetrag, sumBankeinzuge]}
          color={(point) => colors[point.index]}
        />
        {/* <ChartSeriesItem type="bar" data={sumBetrag} />
        <ChartSeriesItem type="bar" data={sumBankeinzuge} /> */}
      </ChartSeries>
    </Chart>
  );
};
export default LieferantopChart;
