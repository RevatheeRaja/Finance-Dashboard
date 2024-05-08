import React, { useState, useEffect } from "react";
import * as ReactDOM from "react-dom";
import { Box, useTheme } from "@mui/material";
import Header from "../../components/Headers";
//the color palletes
import { ColorModeContext, tokens } from "../../theme";
//dummy data
import { mockData } from "../../data/mockData";
import mockPDF from "../../data/mockPDF.pdf";
//syncfusion grid components
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Resize,
  Sort,
  Reorder,
  Group,
  Filter,
  Page,
  ExcelExport,
  PdfExport,
  Edit,
  Inject,
  VirtualScroll,
  CommandColumn,
  Toolbar,
  //actionBegin,
} from "@syncfusion/ej2-react-grids";
import { DataUtil } from "@syncfusion/ej2-data";
//icons

import FileDownloadIcon from "@mui/icons-material/FileDownload";

import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { Eject } from "@mui/icons-material";

const Archivsyncfusion = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  let grid;

  //grid Filter type
  const gridFilter = {
    //type: "Menu",
    type: "Excel",
  };
  //3. Fetch from API
  const [rowData, setRowData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://fibutronwebapi.fibutron.de/Archiv?MandantNr=100"
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

  // Export to PDF/Excel
  const exportClick = (args) => {
    if (grid) {
      if (args.item.id === "Grid_excelexport") {
        grid.excelExport();
       } //else if (args.item.id === "Grid_pdfexport") {
      //   grid.pdfExport();
      // }
    }
  };
  //Edit and Delete a row with a dialog box
  const editSettings = {
    allowEditing: true,
    allowDeleting: true,
    mode: "Dialog",
  };
  const validationRules = { required: true };
  //date format
  const formatOption = { type: "date", format: "dd/MM/yyyy" };
  const fullDateFormat = { type: "dateTime", format: "dd/MM/yyyy hh:mm a" };

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
      <div>
        <span
          className="e-icons e-download"
          id="pdfDownload"
          onClick={handlePdfDownload}
        ></span>
      </div>
    );
  };
  //markierung Template
  let loc = { width: "31px", height: "24px" };
  const markTemplate = (props) => {
    let MarkImage =
      props.markierung === "Important"
        ? `${process.env.PUBLIC_URL}/assets/image/important.png`
        : props.markierung === "Read"
        ? `${process.env.PUBLIC_URL}/assets/image/readCategory.png`
        : props.markierung === "Green Category"
        ? `${process.env.PUBLIC_URL}/assets/image/greenCategory.png`
        : props.markierung === "Blue Category"
        ? `${process.env.PUBLIC_URL}/assets/image/blueCategory.png`
        : props.markierung === "Red Category"
        ? `${process.env.PUBLIC_URL}/assets/image/redCategory.png`
        : null;

    return (
      <div>
        {MarkImage && <img style={loc} src={MarkImage} alt="" />}
        {/* <span id="Marktext">{props.markierung}</span> */}
      </div>
    );
  };
 
  return (
    <Box
      m="20px"
      sx={{
         "& .e-grid .e-table > tbody > tr:nth-of-type(even)": {
           background: colors.primary[100],
         },
         "& .e-grid .e-table > tbody > tr:nth-of-type(odd)": {
          background: colors.primary[300],
        },
        "& .e-grid .e-headercell":{
          background: colors.indigo[300],
        }
      }}
    >
      <Header title="ARCHIV" subtitle="Data grid using Sync fusion"></Header>
      <GridComponent
        id="Grid"
        dataSource={DataUtil.parse.parseJson(mockData)}
        toolbar={["Search", "ExcelExport", "PdfExport", "Edit", "Delete"]}
        toolbarClick={exportClick}
        allowPaging={true}
        allowSorting={true}
        allowReordering={true}
        allowResizing={true}
        autoFit={true}
        allowFiltering={true}
        filterSettings={gridFilter}
        allowGrouping={true}
        //enableVirtualization={true} height={400}
        allowExcelExport={true}
        allowPdfExport={true}
        //edit and delete
        editSettings={editSettings}
        ref={(g) => (grid = g)}
      >
        <ColumnsDirective>
          <ColumnDirective
            field=""
            headerText="Download"
            width="50"
            template={template}
            textAlign="Center"
            allowEditing={false}
          />
          <ColumnDirective
            field="markierung"
            headerText="Markings"
            width="100"
            editType="dropdownedit"
            template={markTemplate}
          />
          <ColumnDirective
            field="id"
            headerText="ID"
            width="100"
            allowGrouping={false}
            isPrimaryKey={true}
          />

          <ColumnDirective
            field="thema"
            headerText="Thema"
            width="150"
            validationRules={validationRules}
          />
          <ColumnDirective
            field="name"
            headerText="Name"
            width="200"
            validationRules={validationRules}
          />
          <ColumnDirective
            field="strasse"
            headerText="Strasse"
            width="150"
            allowGrouping={false}
          />
          <ColumnDirective
            field="vorgangsart"
            headerText="Vorgangsart"
            width="150"
            editType="dropdownedit"
          />
          <ColumnDirective
            field="belegnummer"
            headerText="Belegnummer"
            width="150"
            allowGrouping={false}
            validationRules={validationRules}
          />
          <ColumnDirective
            field="partnerkategorie"
            headerText="Partnerkategorie"
            width="150"
            editType="dropdownedit"
          />
          <ColumnDirective
            field="kundenliefkonto"
            headerText="Konto"
            width="150"
            validationRules={validationRules}
            allowGrouping={false}
          />
          <ColumnDirective
            field="dokumentendatum"
            headerText="Datum"
            width="100"
            format={formatOption}
            textAlign="Right"
            editType="datepickeredit"
          />

          <ColumnDirective
            field="barcode"
            headerText="Barcode"
            width="150"
            allowGrouping={false}
          />
          <ColumnDirective field="notizen" headerText="Notizen" width="150" />
          <ColumnDirective
            field="seitenzahl"
            headerText="Seite"
            width="100"
            editType="numericedit"
            allowGrouping={false}
          />
        </ColumnsDirective>
        <Inject
          services={[
            Toolbar,
            Resize,
            Sort,
            Filter,
            Reorder,
            VirtualScroll,
            Group,
            Page,
            ExcelExport,
            PdfExport,
            Edit,
          ]}
        />
      </GridComponent>
      {/* <DialogComponent
        target="#dialog"
        width="250px"
        content="This is a PDF download"
        visible={status.hideDialog}
        close={dialogClose}
      /> */}
    </Box>
  );
};
export default Archivsyncfusion;
