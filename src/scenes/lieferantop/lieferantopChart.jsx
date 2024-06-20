import React, { useState, useEffect, useCallback, useRef } from "react";
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


const bankBalance = 3000;
const categories = ["Balance", "Betrag", "Bankeinzuge"];
const colors = ["#4caf50", "#2196f3", "#ff9800"]; // Example colors for each bar
const LieferantopChart = () => {
  const [betrag, setBetrag] = useState(0);
  const [bankeinzuge, setBankeinzuge] = useState(0);
  useEffect(() => {
    const fetchSums = async () => {
      try {
        const fetchedBetrag = await sumBetrag;
        const fetchedBankeinzuge = await sumBankeinzuge;
        setBetrag(fetchedBetrag);
        setBankeinzuge(fetchedBankeinzuge);
      } catch (error) {
        console.error("Error fetching sums: ", error);
      }
    };

    fetchSums();
  }, []);
  return (
    <Chart>
      <ChartCategoryAxis>
        <ChartCategoryAxisItem categories={categories}></ChartCategoryAxisItem>
      </ChartCategoryAxis>
      <ChartSeries>
        <ChartSeriesItem
          type="column"
          data={[bankBalance, betrag, bankeinzuge]}
          color={(point) => colors[point.index]}
        />
        {/* <ChartSeriesItem type="bar" data={sumBetrag} />
        <ChartSeriesItem type="bar" data={sumBankeinzuge} /> */}
      </ChartSeries>
    </Chart>
  );

};
export default LieferantopChart;
