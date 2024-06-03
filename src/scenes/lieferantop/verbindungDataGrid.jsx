import React, { useState, useEffect, useCallback, useRef } from "react";
import { Grid, GridColumn, GridToolbar } from "@progress/kendo-react-grid";
import {
  selectedRows,
  addSelectedRows,
  resetSelectedRows,
  getSelectedRows,
  getDeletedRows,
  removeSelectedRow,
} from "./dataStore";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@progress/kendo-react-buttons";
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

const VerbindungDataGrid = () => {
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
    console.log("Deleted Rows:", getDeletedRows());
  };
  const template = (props) => {
    return (
      <td {...props.tdProps}>
        <DeleteIcon onClick={() => handleDelete(props.dataItem)} id="Delete" />
      </td>
    );
  };

  /***********HANDLE ROW DELETE ends*************************** */
  return (
    <Grid data={gridData}>
      <GridToolbar>
        <div className="export-btns-container">
          <Button>Reset All</Button> <br />
        </div>
      </GridToolbar>
      <GridColumn title="Action" width="90px" cell={template} />
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
