import React, { useState, useEffect, useCallback, useRef } from "react";
import { Grid, GridColumn, GridToolbar } from "@progress/kendo-react-grid";
import { Button } from "@progress/kendo-react-buttons";
import Swal from "sweetalert2";
import { mockkundenop } from "../../data/mockKundenop";
import { selectedRows, getSelectedRows, removeSelectedRow } from "./dataStore";
/*****ICONS SECTION FROM MATERIAL UI ICONS******** */
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
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

const LastschriftDataGrid = ({ onAppendDeletedRow }) => {
  /*********************HANDLE RESET***************************** */
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
  const template = (props) => {
    return (
      <td {...props.tdProps}>
        <DeleteIcon onClick={() => handleDelete(props.dataItem)} id="Delete" />
      </td>
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
    /*********************HANDLE RESET ends***************************** */
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
      <GridColumn field="Betrag" title="OP Freigeben" width="120px" />
      <GridColumn field="Betrag" title="Betrag Ändern" width="120px" />
      <GridColumn field="Differenz" title="Differenz" width="80px" />
      <GridColumn field="Belegnummer" title="Belegnummer" width="100px" />
      <GridColumn field="Bezeichnung" title="Bezeichnung" width="180px" />
      <GridColumn field="Text" title="Text" width="180px" />
      <GridColumn
        field="Valuta"
        title="Valuta"
        width="120px"
        cells={{ data: DateCell }}
      />
      <GridColumn
        field="Faellig"
        title="Faellig"
        width="150px"
        cells={{ data: DateCell }}
      />
      <GridColumn field="SkontoFrist" title="SkontoFrist" width="150px" />
      <GridColumn field="SkontoProzent" title="SkontoProzent" width="150px" />
      <GridColumn field="Saldo" title="Saldo" width="150px" />
      <GridColumn field="ZahlungsArt" title="ZahlungsArt" width="150px" />
      <GridColumn field="Bankkonto" title="IBAN" width="150px" />
      <GridColumn field="BLZ" title="BIC" width="150px" />
      <GridColumn
        field="Belegdatum"
        title="Belegdatum"
        width="150px"
        cells={{ data: DateCell }}
      />
      <GridColumn field="Letzte Mahnung" title="Letzte Mahnung" width="150px" />
      <GridColumn field="Mahnstufe" title="Mahnstufe" width="150px" />
      <GridColumn
        field="OriginalBetrag"
        title="Original Betrag"
        width="150px"
      />
      <GridColumn field="Notiz" title="Notiz" width="150px" />
      <GridColumn field="Workflows" title="Workflows" width="150px" />
    </Grid>
  );
};

export default LastschriftDataGrid;
