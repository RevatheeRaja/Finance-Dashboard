import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

/********ESSENTIAL KENDO REACT GRID COMPONENTS************************ */
import {
  Grid,
  GridColumn,
  GridToolbar,
  getSelectedState,
} from "@progress/kendo-react-grid";
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
import VerbindungDataGrid from "./verbindungDataGrid";
import {
  selectedRows,
  addSelectedRows,
  resetSelectedRows,
  getSelectedRows,
  getDeletedRows,
  removeSelectedRow,
  resetDeletedRows,
} from "./dataStore";
/********DUMMY DATA FOR TEST****************** */
import { mockverbindlichkeit } from "../../data/mockverbindlichkeit";
/************* */
import { verbindungArray } from "./selectedRow";
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
const idGetter = getter("interneBelegnummer");
const LieferantopDataGrid = () => {
  const navigate = useNavigate();
  const [currentSelectedState, setCurrentSelectedState] = useState({}); //OBEJECT
  const [dataState, setDataState] = React.useState(initialDataState);
  const [data, setData] = useState([]);
  const [collapsedState, setCollapsedState] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [updatedData, setUpdatedData] = useState([]);
  // const [verbindugArray, setVerbindungArray] = useState([])
  //MOCK DATA
  /*  const [result, setResult] = useState(() => {
    const savedState = localStorage.getItem("gridState");
    return savedState
      ? JSON.parse(savedState)
      : processWithGroups(
          mockverbindlichkeit.map((item) => ({
            ...item,
            ["selected"]: currentSelectedState[idGetter(item)],
          })),
          initialDataState
        );
  });

  useEffect(() => {
    localStorage.setItem("gridState", JSON.stringify(result));
  }, [result]);
  useEffect(() => {
    console.log("Current selected state:", currentSelectedState);
  }, [currentSelectedState]);

  useEffect(() => {
    console.log("Result state:", result);
  }, [result]);
 */
  //MOCK DATA
  const [result, setResult] = React.useState(
    processWithGroups(
      mockverbindlichkeit.map((item) => ({
        ...item,
        ["selected"]: currentSelectedState[idGetter(item)],
      })),
      initialDataState
    )
  );
  useEffect(() => {
    console.log("UPdated data after desired operation:", result.data);
  }, [result.data]);

  /*****************EXTERNAL API DATA BINDING************************************ */
  /*const [result, setResult] = useState({ data: [], total: 0 });
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
      setResult(processWithGroups(data.map((item) => ({
        ...item,
        ['selected'] : currentSelectedState[idGetter(item)],
      })), dataState));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData();
}, []);*/
  /***************************DATA BINDING ENDS*******************************************************/

  /***************ONDATASTATECHANGE**************** */
  const onDataStateChange = useCallback(
    (e) => {
      //let updatedState = createDataState(e.dataState);
      const newDataState = processWithGroups(
        mockverbindlichkeit.map((item) => ({
          ...item,
          ["selected"]: currentSelectedState[idGetter(item)],
        })),
        e.dataState
      );
      /* const newDataState = processWithGroups(
        data.map((item) => ({
          ...item,
          ["selected"]: currentSelectedState[idGetter(item)],
        })),
        e.dataState
      ); */
      //const newDataState = processWithGroups(data, e.dataState);
      setDataState(e.dataState);
      setResult(newDataState);
    },
    [currentSelectedState]
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
  /***************GROUPING WITH EXPAND AND COLLAPSE FUNCTIONS ENDS *********************** */
  const setSelectedValue = (data) => {
    let newData = data.map((item) => {
      if (item.items) {
        return {
          ...item,
          items: setSelectedValue(item.items),
        };
      } else {
        return {
          ...item,
          ["selected"]: currentSelectedState[idGetter(item)],
        };
      }
    });
    return newData;
  };
  let newData = setExpandedState({
    data: setSelectedValue(result.data),
    collapsedIds: collapsedState,
  });
  const getCurrentPageDataItems = (data) => {
    let dataItems = [];
    data.forEach((item) => {
      if (item.items) {
        dataItems.push(...getCurrentPageDataItems(item.items));
      } else {
        dataItems.push(item);
      }
    });
    return dataItems;
  };

  /******************onHeaderSelectionChange************************* */
  const onHeaderSelectionChange = useCallback(
    (event) => {
      const pageDataItems = getCurrentPageDataItems(newData);
      if (pageDataItems.length > 0) {
        const checkboxElement = event.syntheticEvent.target;
        const checked = checkboxElement.checked;
        const newSelectedState = {
          ...currentSelectedState,
        };
        pageDataItems.forEach((item) => {
          newSelectedState[idGetter(item)] = checked;
        });
        setCurrentSelectedState(newSelectedState);
      }
    },
    [newData, currentSelectedState]
  );
  /********************onHeaderSelectionChange ends****************** */
  const onSelectionChange = useCallback(
    (event) => {
      const newSelectedState = getSelectedState({
        event,
        selectedState: currentSelectedState,
        dataItemKey: "interneBelegnummer",
      });
      setCurrentSelectedState(newSelectedState);
    },
    [currentSelectedState]
  );
  /***************checkHeaderSelectionValue*************************** */
  const checkHeaderSelectionValue = () => {
    const pageDataItems = getCurrentPageDataItems(newData);
    return (
      newData.length > 0 &&
      pageDataItems.filter((item) => item.selected).length ==
        pageDataItems.length
    );
  };
  /**************checkHeaderSelectionValue ENDS************************ */
  /*******************HANDLE GRID EXCEL EXPORT**************************** */
  const _export = useRef(null);
  const excelExport = () => {
    if (_export.current !== null) {
      _export.current.save();
    }
  };
  /*******************EXCEL EXPORT ENDS**************************** */
  /**************handleZahlung********************** */
  const handleZahlung = () => {
    console.log("Button pressed");

    // Step 1: Get the selected rows
    const selectedItems = Object.keys(currentSelectedState)
      .filter((key) => currentSelectedState[key])
      .map((key) =>
        result.data.find((item) => item.interneBelegnummer === key)
      );
    console.log("Selected items for Zahlung:", selectedItems);
    // Step 2: Remove selected rows from the parent data
    const updatedData = result.data.filter(
      (item) =>
        !selectedItems.some(
          (selected) => selected.interneBelegnummer === item.interneBelegnummer
        )
    );
    console.log("Parent grid data before update:", result.data);
    console.log("Updated data:", updatedData);
    // Step 3: Update the state
    setResult((prevState) => ({
      ...prevState,
      data: updatedData,
      total: prevState.total - selectedItems.length,
    }));
    let newData = setExpandedState({
      data: setSelectedValue(updatedData),
      collapsedIds: collapsedState,
    });
    // Clear the current selected state
    setCurrentSelectedState({});
    console.log("Parent grid data after removing selected rows:", updatedData);
    //after this update write this updated data to the API using put/post and rerender the datagrid.
    //refer the sample code saved as lieferentopDatagrid_getPostAPI in backups

    // Step 4: Add selected rows to child grid
    addSelectedRows(selectedItems);
    navigate("/verbindungDataGrid");
  };
  const handleAppendDeletedRow = (dataItem) => {
    console.log("Appending deleted row back to parent grid:", dataItem);

    // Append the deleted row to the updatedData
    const newUpdatedData = [...updatedData, dataItem];
    setResult((prevState) => ({
      ...prevState,
      data: newUpdatedData,
    }));
    setUpdatedData(newUpdatedData); // Ensure updatedData state is in sync
    // Log the updated data
    console.log("Updated data after appending deleted row from child grid:", newUpdatedData);
    // Reset the intermediate deleted rows array in datastore.
    resetDeletedRows();
  };
  /************handleZahlung Ends******************* */
  /**************handleBank********************** */
  const handleBank = () => {
    console.log("Bank Button pressed");
  };
  /************handleBank Ends******************* */
  useEffect(() => {
    //console.log("Updated newData:", newData);
  }, [newData]);

  return (
    <>
      <ExcelExport data={result.data} ref={_export}>
        <Grid
          data={newData}
          groupable={true}
          resizable={true}
          reorderable={true}
          sortable={true}
          pageable={{ pageSizes: true }}
          onExpandChange={onExpandChange}
          expandField="expanded"
          selectedField={"selected"}
          onHeaderSelectionChange={onHeaderSelectionChange}
          onSelectionChange={onSelectionChange}
          dataItemKey="interneBelegnummer"
          onDataStateChange={onDataStateChange}
          {...dataState}
          total={result.total}
        >
          <GridToolbar>
            <div className="export-btns-container">
              <Button onClick={excelExport}>Excel export</Button> <br />
            </div>
            <div className="export-btns-container">
              <Button onClick={handleZahlung}>
                Freigegebene Zahlungen ausführen
              </Button>
            </div>
            <div className="export-btns-container">
              <Button onClick={handleBank}>Bankverbindung ändern</Button>
            </div>
          </GridToolbar>
          <GridColumn field="selected" width={80} />
          <GridColumn field="betrag" title="OP Freigeben" width={120} />
          <GridColumn field="betrag" title="Betrag Ändern" width={120} />
          <GridColumn field="belegnummer" title="Belegnummer" width={200} />
          <GridColumn
            field="interneBelegnummer"
            title="interneBelegnummer"
            width={200}
          />
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
      <VerbindungDataGrid onAppendDeletedRow={handleAppendDeletedRow} />
    </>
  );
};

export default LieferantopDataGrid;
