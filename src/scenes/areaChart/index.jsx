import * as React from "react";
import { Box, useTheme } from "@mui/material";
import Header from "../../components/Headers";
//the color palletes
import { tokens } from "../../theme";
import { areaChartData } from "../../data/mockArea";
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
  //exportVisual,
} from "@progress/kendo-react-charts";
import "hammerjs";
// import { Button } from "@progress/kendo-react-buttons";
// import { exportPDF } from "@progress/kendo-drawing";
// import { saveAs } from "@progress/kendo-file-saver";
const Areachart = () => {
  //color theme
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { categories, income, expenditure, budget } = areaChartData;
  const suffix = "k €";
  const labelContent = (e) => e.value + suffix;

  {
    return (
      <Box m="20px">
        <Header
          title="Area Chart"
          subtitle="Compare your income with expenditure"
        />
        <div>
         
          <Chart pannable={true} zoomable={true}>
            <ChartArea
              background={`${
                theme.palette.mode === "dark" ? "#121b68" : "#F5F5F5"
              }`}
              opacity={0.5}
              margin={30}
              width={900}
            />
            <ChartTitle
              text="Income vs Expenditure"
              color={`${theme.palette.mode === "dark" ? "white" : "#3d3d3d"}`}
            />
            <ChartLegend
              position="bottom"
              orientation="horizontal"
              background="#F5F5F5"
            />
            <ChartCategoryAxis>
              <ChartCategoryAxisItem
                categories={categories}
                color={`${theme.palette.mode === "dark" ? "white" : "#3d3d3d"}`}
                title={{
                  text: "Months",
                  color: `${
                    theme.palette.mode === "dark" ? "white" : "#3d3d3d"
                  }`,
                }}
              />
            </ChartCategoryAxis>
            <ChartValueAxis>
              <ChartValueAxisItem
                color={`${theme.palette.mode === "dark" ? "white" : "#3d3d3d"}`}
                labels={{
                  content: labelContent,
                  color: `${
                    theme.palette.mode === "dark" ? "white" : "#3d3d3d"
                  }`,
                }}
              />
            </ChartValueAxis>
            <ChartSeries>
              <ChartSeriesItem
                type="area"
                name="Income"
                color={`${
                  theme.palette.mode === "dark" ? "#57DCBE" : "#6EB5FF"
                }`}
                opacity={100}
                data={income}
                line={{
                  style: "smooth",
                }}
              />
              <ChartSeriesItem
                type="area"
                name="Budget"
                color={`${
                  theme.palette.mode === "dark" ? "#C21B5B" : "#D5AAFF"
                }`}
                opacity={100}
                data={budget}
                line={{
                  style: "smooth",
                }}
              />
              <ChartSeriesItem
                type="area"
                name="Expenditure"
                color={`${
                  theme.palette.mode === "dark" ? "#57ACDE" : "#AFF8DB"
                }`}
                opacity={100}
                data={expenditure}
                line={{
                  style: "smooth",
                }}
              />
            </ChartSeries>
          </Chart>
        </div>
      </Box>
    );
  }
};

export default Areachart;
