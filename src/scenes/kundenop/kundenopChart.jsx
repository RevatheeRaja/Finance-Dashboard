
import React, { useState,useEffect} from "react";
import {totalBetragBeforeToday,sumBetrag } from './calculatePayments'
import {Chart, ChartSeries, ChartSeriesItem, ChartCategoryAxisItem,ChartCategoryAxis} from '@progress/kendo-react-charts'
import 'hammerjs'
const KundenopChart = () => {
  const [rowData, setRowData] = useState((null));
  //3.
   useEffect(() => {
     const fetchData = async () => {
       try {
         // Fetch data from your localhost API
         const response = await fetch(
           "https://fibutronwebapi.fibutron.de/api/fin-api/get-daily-balance?IBAN=DE31100777770760965400"
         );
         if (!response.ok) {
           throw new Error("Failed to fetch data");
         }
         const data = await response.json();
         setRowData(data);
       } catch (error) {
         console.error("Error fetching data:", error);
       }
     };

    fetchData();
   }, []);
  // const bankBalance = rowData;
  const bankBalance = 900.23;
   console.log(bankBalance);
   const categories = ["Balance", "Betrag", "Faellige Betrag"];
   const colors = ["#4caf50", "#2196f3", "#ff9800"]; // Example colors for each bar
  return (
    <Chart>
      <ChartCategoryAxis>
        <ChartCategoryAxisItem categories={categories}></ChartCategoryAxisItem>
      </ChartCategoryAxis>
      <ChartSeries>
        <ChartSeriesItem
          type="column"
          data={[bankBalance, sumBetrag, totalBetragBeforeToday]}
          color={(point) => colors[point.index]}
        />
      </ChartSeries>
    </Chart>
  )
}

export default KundenopChart