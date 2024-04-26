import React, { useState,useEffect } from "react";
import Header from "../../components/Headers";
import { tokens } from "../../theme";
import { Box, useTheme,  } from "@mui/material";
import {ChartComponent, SeriesCollectionDirective, SeriesDirective, Inject, Category, Legend, Tooltip, LineSeries} from '@syncfusion/ej2-react-charts';
//dummy data
import { lineCustomSeries, LinePrimaryXAxis, LinePrimaryYAxis } from "../../data/mockChart";

const Charts = () =>{
 return(
    <Box m='20px'>
        <ChartComponent id="line-chart" height="500px" primaryXAxis={{ valueType: 'Category', edgeLabelPlacement: 'Shift', majorGridLines: { width: 0 }, labelFormat: 'y' }} >
            <Inject services = {[LineSeries, Category, Legend, Tooltip]} />
            <SeriesCollectionDirective>
                {lineCustomSeries.map((item,index) => 
            <SeriesDirective key={index} {...item}/>)}
            </SeriesCollectionDirective>
        </ChartComponent>
    </Box>
 )
}
export default Charts;