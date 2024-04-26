import React from "react";
import { Box, useTheme } from "@mui/material";
import Header from "../../components/Headers";
import { Grid, GridColumn, GridToolbar } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import { Button } from "@progress/kendo-react-buttons";
import "@progress/kendo-theme-material/dist/all.css";
//dummy data
import { mockData } from "../../data/mockData";
import { useState, useEffect } from "react";
const Archivkendo = () => {

  const [dataState, setDataState] = React.useState({ skip: 0, take: 20 });
  const [result, setResult] = React.useState(process(mockData, dataState));
  const onDataStateChange = (e) => {
    setDataState(e.dataState);
    setResult(process(mockData, e.dataState));
  };

  const _export = React.useRef(null);

  const excelExport = () => {
    if (_export.current !== null) {
      _export.current.save();
    }
  };
  console.log("Result:", result);

  return (
    <Box>
      <Header title="ARCHIV" subtitle="Datagrid using Kendo"></Header>
      <ExcelExport
        data={mockData}
       
        ref={_export}
        onDataStateChange={onDataStateChange}
        {...dataState}
      >
        <Grid
          data={result}
          filterable={true}
          sortable={true}
          groupable={true}
          onDataStateChange={onDataStateChange}
          {...dataState}
          pageable={true}
          total={mockData.length}
        >
          <GridToolbar>
            <div className="export-btns-container">
              <Button onClick={excelExport}>Export to Excel</Button>
            </div>
          </GridToolbar>
          <GridColumn field="id" title="Id" width="150px" />
          <GridColumn field="thema" title="Thema" width="150px" />
          <GridColumn field="name" title="Name" width="250px" />
          <GridColumn field="strasse" title="Strasse" width="150px" />
          <GridColumn field="ort" title="Ort" width="180px" />
          <GridColumn field="vorgangsart" title="Vorgangsart" width="200px" />
          <GridColumn field="belegnummer" title="Belegnummer" width="200px" />
          <GridColumn
            field="partnerkategorie"
            title="Partnerkategorie"
            width="120px"
          />
          <GridColumn field="kundenliefkonto" title="Konto" width="100px" />
          <GridColumn field="stichwort" title="Projekt" width="100px" />
          <GridColumn field="dokumentendatum" title="Datum" width="200px" />
          <GridColumn field="barcode" title="Barcode" width="100px" />
          <GridColumn field="notizen" title="Notizen" width="100px" />
          <GridColumn field="seitenzahl" title="Seiten" width="100px" />
        </Grid>
      </ExcelExport>
    </Box>
  );
};
export default Archivkendo;
