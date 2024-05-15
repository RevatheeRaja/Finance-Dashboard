import React from "react";
import { useState, useEffect } from "react";
import { Box, useTheme } from "@mui/material";
import Header from "../../components/Headers";
//Kendo grid components
import { Grid, GridColumn, GridToolbar } from "@progress/kendo-react-grid";
import { ColumnMenu, ColumnMenuCheckboxFilter } from "./ColumnMenu";
import { process } from "@progress/kendo-data-query";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import { Button } from "@progress/kendo-react-buttons";

import { downloadIcon,pencilIcon } from "@progress/kendo-svg-icons";
//Essential material and icon library
import "@progress/kendo-theme-material/dist/all.css";
import "@progress/kendo-font-icons/dist/index.css";
//dummy data
import { mockData } from "../../data/mockData";
import mockPDF from "../../data/mockPDF.pdf";

const Archivkendo = () => {
  const [dataState, setDataState] = React.useState({ skip: 0, take: 20 });
  const [result, setResult] = React.useState(process(mockData, dataState));

  //onDataStateChange
  const onDataStateChange = (e) => {
    //let updatedState = createDataState(e.dataState);
    setDataState(e.dataState);
    setResult(process(mockData, e.dataState));
  };

  //Export as Excel
  const _export = React.useRef(null);

  const excelExport = () => {
    if (_export.current !== null) {
      _export.current.save();
    }
  };

  //handle invoice download
  const handlePdfDownload = async () => {
    try {
      //'https://api3.fibutron.de/Download/DownloadFile?Mandant=100&BWDOCID=74644789'
      const response = await fetch(mockPDF);
      console.log(response);
      if (!response.ok) {
        throw new Error("failed to download");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Create a link element
      const link = document.createElement("a");
      link.href = url;
      link.download = "Report.pdf";
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("error downloading the file");
    }
  };
  //Download invoice/PDF template
  const template = (props) => {
    return (
      <td {...props.tdProps}>
        <Button
          className="buttons-container-button"
          svgIcon={downloadIcon}
          onClick={handlePdfDownload}
          id="pdfDownload"
        ></Button>
      </td>
    );
  };
  //Edit Template
  const handleEdit = () =>{
    console.log('Edit Clicked');
  }
  const Edittemplate = (props) => {
    return <td {...props.tdProps}> 
      <Button
      className="buttons-container-button"
      svgIcon={pencilIcon}
      onClick={handleEdit}
      id="pdfDownload">

      </Button>

    </td>;
  };
  //Markierung Template
  let loc = { width: "31px", height: "24px" };
  const markTemplate = (props) => {
    const { dataItem } = props;
    let MarkImage =
      // console.log("props.markierung:", props.dataItem.markierung);
      props.dataItem.markierung === "Important"
        ? `${process.env.PUBLIC_URL}/assets/image/important.png`
        : props.dataItem.markierung === "Read"
        ? `${process.env.PUBLIC_URL}/assets/image/readCategory.png`
        : props.dataItem.markierung === "Green Category"
        ? `${process.env.PUBLIC_URL}/assets/image/greenCategory.png`
        : props.dataItem.markierung === "Blue Category"
        ? `${process.env.PUBLIC_URL}/assets/image/blueCategory.png`
        : props.dataItem.markierung === "Red Category"
        ? `${process.env.PUBLIC_URL}/assets/image/redCategory.png`
        : null;
    // console.log(MarkImage)
    return (
      <td {...props.tdProps}>
        {MarkImage && <img style={loc} src={MarkImage} alt="" />}
        {/* <span id="Marktext">{props.markierung}</span> */}
      </td>
    );
  };
  return (
    <Box>
      <Header title="ARCHIV" subtitle="Datagrid using Kendo"></Header>
      <ExcelExport
        data={result}
        ref={_export}
        onDataStateChange={onDataStateChange}
        {...dataState}
      >
        <Grid
          data={result}
          // filterable={true}
          sortable={true}
          groupable={true}
          resizable={true}
          pageable={true}
          reorderable={true}
          onDataStateChange={onDataStateChange}
          {...dataState}
          total={mockData.length}
        >
          <GridToolbar>
            <div className="export-btns-container">
              <Button onClick={excelExport}>Export to Excel</Button>
            </div>
          </GridToolbar>
          <GridColumn
            // field=" "
            title="Download"
            width="90px"
            cells={{ data: template }}
          />
          <GridColumn
            title="Edit"
            width="90px"
            cells={{ data: Edittemplate }}
          />
          <GridColumn
            field="markierung"
            title="Markierung"
            width="150px"
            cells={{ data: markTemplate }}
            columnMenu={ColumnMenuCheckboxFilter}
          />
          <GridColumn
            field="id"
            title="Id"
            width="150px"
            filter={"numeric"}
            columnMenu={ColumnMenu}
          />
          <GridColumn
            field="thema"
            title="Thema"
            width="150px"
            columnMenu={ColumnMenuCheckboxFilter}
          />
          <GridColumn
            field="name"
            title="Name"
            width="250px"
            columnMenu={ColumnMenuCheckboxFilter}
          />
          <GridColumn
            field="strasse"
            title="Strasse"
            width="150px"
            columnMenu={ColumnMenuCheckboxFilter}
          />
          <GridColumn
            field="ort"
            title="Ort"
            width="180px"
            columnMenu={ColumnMenuCheckboxFilter}
          />
          <GridColumn
            field="vorgangsart"
            title="Vorgangsart"
            width="200px"
            columnMenu={ColumnMenuCheckboxFilter}
          />
          <GridColumn
            field="belegnummer"
            title="Belegnummer"
            width="200px"
            filter={"numeric"}
            columnMenu={ColumnMenu}
          />
          <GridColumn
            field="partnerkategorie"
            title="Partnerkategorie"
            width="120px"
            columnMenu={ColumnMenuCheckboxFilter}
          />
          <GridColumn
            field="kundenliefkonto"
            title="Konto"
            width="100px"
            columnMenu={ColumnMenuCheckboxFilter}
          />
          <GridColumn
            field="stichwort"
            title="Projekt"
            width="100px"
            columnMenu={ColumnMenuCheckboxFilter}
          />
          <GridColumn
            field="dokumentendatum"
            title="Datum"
            width="200px"
            columnMenu={ColumnMenuCheckboxFilter}
          />
          <GridColumn
            field="barcode"
            title="Barcode"
            width="100px"
            filter={"numeric"}
            columnMenu={ColumnMenu}
          />
          <GridColumn
            field="notizen"
            title="Notizen"
            width="100px"
            columnMenu={ColumnMenuCheckboxFilter}
          />
          <GridColumn field="seitenzahl" title="Seiten" width="100px" />
        </Grid>
      </ExcelExport>
    </Box>
  );
};
export default Archivkendo;
