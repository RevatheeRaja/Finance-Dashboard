import React from "react";
import { Box, useTheme } from "@mui/material";
import { useEffect } from "react";
import Header from "../../components/Headers";
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  Category,
  Legend,
  Tooltip,
  SplineAreaSeries,
} from "@syncfusion/ej2-react-charts";
import { areaCustomSeries } from "../../data/mockArea";
const Areachart = () => {
  return (
    <Box m="20px">
      <Header title="INFLATION RATE" subtitle="Insights at a Glance"></Header>
      <ChartComponent
        id="line-chart"
        height="500px"
        primaryXAxis={{
          valueType: "Category",
          edgeLabelPlacement: "Shift",
          majorGridLines: { width: 0 },
          labelFormat: "y",
        }}
        primaryYAxis={{
          majorTickLines: { width: 0 },
          minimum: 0,
          maximum: 100,
          edgeLabelPlacement: "Shift",
          labelFormat: "€{value}",
          lineStyle: { width: 0 },
          labelStyle: { size: "11px" },
          titleStyle: { size: "13px" },
        }}
      >
        <Inject services={[SplineAreaSeries, Category, Legend, Tooltip]} />
        <SeriesCollectionDirective>
          {areaCustomSeries.map((item, index) => (
            <SeriesDirective key={index} {...item} />
          ))}
        </SeriesCollectionDirective>
      </ChartComponent>
    </Box>
  );
};
export default Areachart;
