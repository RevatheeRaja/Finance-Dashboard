import React, { useState, useEffect, useCallback, useRef } from "react";
import { Grid, GridColumn, GridToolbar } from "@progress/kendo-react-grid";
import Swal from "sweetalert2";
import { selectedRows, getSelectedRows, removeSelectedRow } from "./dataStore";
/*****ICONS SECTION FROM MATERIAL UI ICONS******** */
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
/********** */
import { Button } from "@progress/kendo-react-buttons";
import mockPDF from "../../data/mockPDF.pdf";
/***********DATE FORMATTER TEMPLATE*************************** */
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};
const DateCell = (props) => <td>{formatDate(props.dataItem[props.field])}</td>;
/***********DATE FORMAT ENDS*************************** */

const VerbindungDataGrid = ({ onAppendDeletedRow }) => {
  // Now you can use verbindungArray as your data
  console.log("Selected Rows", selectedRows); // Example usage: logging the array

  /***********HANDLE ROW DELETE*************************** */
  const [gridData, setGridData] = useState(getSelectedRows());

  const handleDelete = (dataItem) => {
    console.log("Child delete Button pressed");
    console.log("Deleting row:", dataItem);
    removeSelectedRow(dataItem); // Remove from data store
    setGridData(getSelectedRows()); // Update grid data
    console.log("Updated Selected Rows:", getSelectedRows());
    console.log("Deleted Rows:", dataItem);
    // Notify parent about the deleted row
    /*  addDeletedRows([dataItem]);
    window.alert(`Appended ${dataItem} row(s) back to the parent grid.`); */
    // Notify parent about the deleted row
    if (onAppendDeletedRow && typeof onAppendDeletedRow === "function") {
      onAppendDeletedRow(dataItem);
    }
    Swal.fire({
      icon: "success",
      title: "Erfolgreich gelöscht",
      text: "Die ausgewählte Zahlung wird gelöscht und zurück in LieferantOP verschoben. Danke!",
      customClass: {
        confirmButton: "btn-custom-class",
        title: "title-class",
      },
      buttonsStyling: false,
    }); 
    window.alert(
      `Appended ${JSON.stringify(dataItem)} row(s) back to the parent grid.`
    );
  };
  const handleResetAll = () => {
    console.log("Reset All Button pressed");
    const rowsToReset = [...gridData];
    setGridData([]); // Clear child grid data

    if (onAppendDeletedRow && typeof onAppendDeletedRow === "function") {
      rowsToReset.forEach((dataItem) => {
        onAppendDeletedRow(dataItem);
      });
    }
    Swal.fire({
      icon: "success",
      title: "Erfolgreich gelöscht",
      text: "Die ausgewählte Zahlung wird gelöscht und zurück in LieferantOP verschoben. Danke!",
      customClass: {
        confirmButton: "btn-custom-class",
        title: "title-class",
      },
      buttonsStyling: false,
    }); 
    
    // window.alert(
    //   `Appended ${rowsToReset.length} row(s) back to the parent grid.`
    // );
  };
  const template = (props) => {
    return (
      <td {...props.tdProps}>
        <DeleteIcon onClick={() => handleDelete(props.dataItem)} id="Delete" />
      </td>
    );
  };

  /***********HANDLE ROW DELETE ends*************************** */
  /*******************HANDLE INVOICE DOWNLOAD ON EVERY ROW********************************** */
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
      // Display success message
      Swal.fire({
        icon: "success",
        title: "Erfolgreich herunterladen",
        text: "Bitte verwenden Sie dieses Dokument für die Banküberweisung. Danke!",
        customClass: {
          confirmButton: "btn-custom-class",
          title: "title-class",
        },
        buttonsStyling: false,
      }); 
    } catch (error) {
      console.error("error downloading the file");
    }
  };

  //Download invoice/PDF template
  const downloadTemplate = (props) => {
    return (
      <td {...props.tdProps}>
        <DownloadIcon onClick={handlePdfDownload} id="pdfDownload" />
      </td>
    );
  };
  /*******************HANDLE INVOICE DOWNLOAD ON EVERY ROW ENDS********************************** */
  return (
    <Grid data={gridData}>
      <GridToolbar>
        <div className="export-btns-container">
          <Button onClick={handleResetAll}>Reset All</Button> <br />
        </div>
      </GridToolbar>
      <GridColumn title="Action" width="90px" cell={template} />
      <GridColumn
        title="Download"
        width="90px"
        cells={{ data: downloadTemplate }}
      />
      <GridColumn field="betrag" title="OP Freigeben" width={120} />
      <GridColumn field="betrag" title="Betrag Ändern" width={120} />
      <GridColumn field="belegnummer" title="Belegnummer" width={200} />
      <GridColumn field="name" title="Bezeichnung" width={300} />
      <GridColumn field="text" title="Text" width={200} />
      <GridColumn
        field="valuta"
        title="Valuta"
        width={120}
        cells={{ data: DateCell }}
      />
      <GridColumn
        field="faellig"
        title="Fällig"
        width={120}
        cells={{ data: DateCell }}
      />
      <GridColumn
        field="skonto1Bis"
        title="SkontoFrist"
        width={120}
        cells={{ data: DateCell }}
      />
      <GridColumn field="skonto1Prozent" title="Skonto%" />
      <GridColumn field="saldo" title="Saldo" width={120} />
      <GridColumn field="ibanNummer" title="IBAN" width={120} />
      <GridColumn field="swifT_Adr" title="BIC" width={120} />
      <GridColumn field="belegdatum" title="Belegdatum" width={120} />
      <GridColumn field="kdNrBeiKreditor" title="KdNrBeiKreditor" width={120} />
    </Grid>
  );
};
export default VerbindungDataGrid;
