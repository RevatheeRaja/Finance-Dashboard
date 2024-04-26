import React from "react";
import { Box, useTheme } from "@mui/material";
import Header from "../../components/Headers";
//dummy data
import { mockData } from "../../data/mockData";
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
  Toolbar,
} from "@syncfusion/ej2-react-grids";
import { DataManager, WebApiAdaptor, Query } from "@syncfusion/ej2-data";

const Archivsyncfusion = () => {
  let grid;
  const dataManager = new DataManager({
    url: "https://fibutronwebapi.fibutron.de/Archiv?MandantNr=100",
    adaptor: new WebApiAdaptor(),
    crossDomain: true,
  });  
  const gridFilter = {
    //type: "Menu",
    type: "Excel",
  };
  const toolbarClick = (args) => {
    if (grid) {
      if (args.item.id === "Grid_excelexport") {
        grid.excelExport();
      } else if (args.item.id === "Grid_pdfexport") {
        grid.pdfExport();
      }
    }
  };
  return (
    <Box m="20px">
      <Header title="ARCHIV" subtitle="Data grid using Sync fusion"></Header>
      <GridComponent
        id="Grid"
        //dataSource={dataManager}
        dataSource={mockData}
        //fields={fieldsData}
        toolbar={["Search", "ExcelExport", "PdfExport"]}  toolbarClick={toolbarClick}
        allowPaging = {true}
        allowSorting = {true}
        allowReordering = {true}
        allowFiltering={true} filterSettings={gridFilter}
        allowGrouping={true}
        enableVirtualization={true} enableColumnVirtualization={true} height={400}     
        allowExcelExport={true}
        allowPdfExport={true}
        ref={(g) => (grid = g)}
      >
        <ColumnsDirective>
          <ColumnDirective field="id" headerText="ID" width="100" allowGrouping={false}/>
          <ColumnDirective field="thema" headerText="Thema" width="150" />
          <ColumnDirective field="name" headerText="Name" width="150" />
          <ColumnDirective field="strasse" headerText="Strasse" width="150"allowGrouping={false} />
          <ColumnDirective
            field="vorgangsart"
            headerText="Vorgangsart"
            width="150"
          />
          <ColumnDirective
            field="belegnummer"
            headerText="Belegnummer"
            width="150"
            allowGrouping={false}
          />
          <ColumnDirective
            field="partnerkategorie"
            headerText="Partnerkategorie"
            width="150"
          />
          <ColumnDirective
            field="kundenliefkonto"
            headerText="Konto"
            width="100"
            allowGrouping={false}
          />
          <ColumnDirective
            field="dokumentendatum"
            headerText="Datum"
            width="100"
          />
          <ColumnDirective field="barcode" headerText="Barcode" width="150" allowGrouping={false} />
          <ColumnDirective field="notizen" headerText="Notizen" width="150" />
          <ColumnDirective field="seitenzahl" headerText="Seite" width="100" allowGrouping={false}/>
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
          ]}
        />
      </GridComponent>
    </Box>
  );
};
export default Archivsyncfusion;

