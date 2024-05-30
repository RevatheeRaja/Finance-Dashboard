import React, { useState, useEffect, useCallback, useRef } from "react";

/********ESSENTIAL KENDO REACT GRID COMPONENTS************************ */
import { Grid, GridColumn, GridToolbar } from "@progress/kendo-react-grid";
import { process } from "@progress/kendo-data-query";
import {
  setGroupIds,
  getGroupIds,
  setExpandedState,
} from "@progress/kendo-react-data-tools";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import { Button } from "@progress/kendo-react-buttons";
import { getter } from "@progress/kendo-react-common";
/********ESSENTIAL KENDO REACT GRID COMPONENTS ENDS************************ */

/********DUMMY DATA FOR TEST****************** */
import { mockverbindlichkeit } from "../../data/mockverbindlichkeit";
/************* */

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

/*****INITIAL DATA STATE********** */
/***FOR INITIAL SETUP; show 10 items skip 0 items and set initial grouping to null/empty******* */
/*****Pagination n grouping initialization**** */
const initialDataState = {
  take: 10,
  skip: 0,
  group: [], // Add default groups if needed
};
/*****INITIAL DATA STATE ENDS********** */

/***********PROCESSWITHGROUPS********************** */
const processWithGroups = (data, dataState) => {
  const newDataState = process(data, dataState);
  setGroupIds({
    data: newDataState.data,
    group: dataState.group,
  });
  return newDataState;
};
/***********PROCESSWITHGROUPS ENDS********************** */
const idGetter = getter('interneBelegnummer');
const LieferantopDataGrid = () => {
  const [currentSelectedState, setCurrentSelectedState] = useState({}); //OBEJECT
  const [dataState, setDataState] = React.useState(initialDataState);
  const [data, setData] = useState([]);
  const [collapsedState, setCollapsedState] = useState([]);
  //MOCK DATA
  /*const [result, setResult] = React.useState(
    processWithGroups(mockverbindlichkeit, initialDataState)
  );*/
/*****************EXTERNAL API DATA BINDING************************************ */
const [result, setResult] = useState({ data: [], total: 0 });
//3.
useEffect(() => {
  const fetchData = async () => {
    try {
      // Fetch data from your localhost API
      const response = await fetch(
        "https://fibutronwebapi.fibutron.de/api/operation-process/get-verbindlichkeit-inforamtion?Mandantnummer=923"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      setData(data);
      setResult(processWithGroups(data, dataState));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData();
}, []);
/***************************DATA BINDING ENDS*******************************************************/

  /***************ONDATASTATECHANGE**************** */
  const onDataStateChange = useCallback(
    (e) => {
      //let updatedState = createDataState(e.dataState);
      // const newDataState = processWithGroups(mockverbindlichkeit, e.dataState);
      const newDataState = processWithGroups(data, e.dataState);
      setDataState(e.dataState);
      setResult(newDataState);
    },
    [data]
  );
  /***************ONDATASTATECHANGE ENDS**************** */
 /***************GROUPING WITH EXPAND AND COLLAPSE FUNCTIONS*********************** */
  const onExpandChange = useCallback(
    (event) => {
      const item = event.dataItem;
      if (item.groupId) {
        const collapsedIds = !event.value
          ? [...collapsedState, item.groupId]
          : collapsedState.filter((groupId) => groupId !== item.groupId);
        setCollapsedState(collapsedIds);
      }
    },
    [collapsedState]
  );

  const newData = setExpandedState({
    data: result.data,
    collapsedIds: collapsedState,
  });
 /***************GROUPING WITH EXPAND AND COLLAPSE FUNCTIONS ENDS *********************** */

  /*******************HANDLE GRID EXCEL EXPORT**************************** */
  const _export = useRef(null);
  const excelExport = () => {
    if (_export.current !== null) {
      _export.current.save();
    }
  };
  /*******************EXCEL EXPORT ENDS**************************** */

  return (
    <ExcelExport data={result.data} ref={_export}>
      <Grid
        data={newData}
        groupable={true}
        resizable={true}
        reorderable={true}
        sortable={true}
        pageable={{ pageSizes: true }}
        onDataStateChange={onDataStateChange}
        {...dataState}
        total={result.total}
        onExpandChange={onExpandChange}
        expandField="expanded"
      >
        <GridToolbar>
          <div className="export-btns-container">
            <Button onClick={excelExport}>Export to Excel</Button>
          </div>
        </GridToolbar>

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
          cells={{ data: DateCell }}
          width={120}
        />
        <GridColumn field="skonto1Prozent" title="Skonto%" />
        <GridColumn field="saldo" title="Saldo" width={120} />
        <GridColumn field="ibanNummer" title="IBAN" width={120} />
        <GridColumn field="swifT_Adr" title="BIC" width={120} />
        <GridColumn
          field="belegdatum"
          title="Belegdatum"
          width={120}
          cells={{ data: DateCell }}
        />
        <GridColumn
          field="kdNrBeiKreditor"
          title="KdNrBeiKreditor"
          width={120}
        />
      </Grid>
    </ExcelExport>
  );
};

export default LieferantopDataGrid;
