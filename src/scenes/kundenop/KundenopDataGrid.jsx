import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import Swal from "sweetalert2"; //Alerts
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
import { getter } from "@progress/kendo-react-common";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import { Button } from "@progress/kendo-react-buttons";
import { Input } from "@progress/kendo-react-inputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";

import { mockkundenop } from "../../data/mockKundenop";
//EDIT FORM FOR EDITING THE ROW
import BankChangeForm from "./bankChangeForm"; //Edit using external forms
/************* */
import { addSelectedRows, resetDeletedRows } from "./dataStore";
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
const idGetter = getter("OrginalDVBelegnummer");
const KundenopDataGrid = () => {
  const navigate = useNavigate();
  const [dataState, setDataState] = React.useState(initialDataState);
  const [data, setData] = useState([]);
  const [currentSelectedState, setCurrentSelectedState] = useState({}); //OBEJECT
  const [updatedData, setUpdatedData] = useState([]);
  const [collapsedState, setCollapsedState] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  //MOCK DATA
  /*  const [result, setResult] = useState(
    processWithGroups(mockkundenop, initialDataState)
  ); */
  const [result, setResult] = React.useState(
    processWithGroups(
      mockkundenop.map((item) => ({
        ...item,
        ["selected"]: currentSelectedState[idGetter(item)],
      })),
      initialDataState
    )
  );

  /*****************EXTERNAL API DATA BINDING************************************ */
  /* const [result, setResult] = useState({ data: [], total: 0 });
  //3.
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from your localhost API
        const response = await fetch(
          "https://fibutronwebapi.fibutron.de/api/operation-process/get-forderungen?Mandantnummer=100"
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
  }, []);*/

  /* const onDataStateChange = useCallback(
    (event) => {
      const newDataState = processWithGroups(mockkundenop, event.dataState); //MOCK DATA
      //const newDataState = processWithGroups(data, event.dataState);//API BINDING
      setDataState(event.dataState);
      setResult(newDataState);
    },
    [data]
  ); */
  const onDataStateChange = useCallback(
    (e) => {
      //let updatedState = createDataState(e.dataState);
      const newDataState = processWithGroups(
        mockkundenop.map((item) => ({
          ...item,
          ["selected"]: currentSelectedState[idGetter(item)],
        })),
        e.dataState
      );
      /*  const newDataState = processWithGroups(
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
    [data]
  );
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
  /*  //Update state
  const newData = setExpandedState({
    data: result.data,
    collapsedIds: collapsedState,
  }); */
  /***************GROUPING WITH EXPAND AND COLLAPSE FUNCTIONS ENDS*********************** */
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
  const newData = setExpandedState({
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
        dataItemKey: "OrginalDVBelegnummer",
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
  const _export = React.useRef(null);
  const excelExport = () => {
    if (_export.current !== null) {
      _export.current.save();
    }
  };
  /*******************EXCEL EXPORT ENDS**************************** */
  /************************handleZahlung**************************** */
  const handleZahlung = () => {
    // Step 1: Get the selected rows based on the current selected state
    const selectedItems = Object.keys(currentSelectedState)
      .filter((key) => currentSelectedState[key])
      .map((key) => {
        const findSelectedItem = (items) => {
          for (let item of items) {
            if (item.items) {
              // If the item has a `items` property, it means it's a group
              const found = findSelectedItem(item.items);
              if (found) return found;
            } else if (item.OrginalDVBelegnummer === key) {
              return item;
            }
          }
          return null;
        };
        return findSelectedItem(result.data);
      })
      .filter((item) => item !== null);
    console.log("Selected items for Zahlung:", selectedItems);
    // Step 2: Remove selected rows from the parent data
    const removeSelectedItems = (items) => {
      return items
        .map((item) => {
          if (item.items) {
            // If the item has a `items` property, it means it's a group
            const newItems = removeSelectedItems(item.items);
            return {
              ...item,
              items: newItems,
            };
          } else {
            // If it's a data item, check if it's not selected
            if (
              !selectedItems.some(
                (selected) =>
                  selected.OrginalDVBelegnummer === item.OrginalDVBelegnummer
              )
            ) {
              return item;
            }
          }
          return null;
        })
        .filter((item) => item !== null);
      // Display success message
    };
    const updatedData = removeSelectedItems(result.data);
    console.log("Parent grid data before update:", result.data);
    console.log("Updated data:", updatedData);
    // Step 4: Update the state
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
    Swal.fire({
      icon: "success",
      title: "Erfolgreich",
      text: "Die ausgewählte Rechnung wurde erfolgreich zur Zahlung verschoben. Danke!",
      customClass: {
        confirmButton: "btn-custom-class",
        title: "title-class",
      },
      buttonsStyling: false,
    });
    // Step 5: Add selected rows to child grid
    addSelectedRows(selectedItems);
  };
  /************************handleZahlung Ends**************************** */
  /************handleAppendDeletedRow********************** */
  /**Appends the deleted rows from the child grid back to parent, w/o the API POST** */
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
    console.log(
      "Updated data after appending deleted row from child grid:",
      newUpdatedData
    );
    // Reset the intermediate deleted rows array in datastore.
    resetDeletedRows();
  };
  /************handleAppendDeletedRow ENDS********************** */
  /*************handleZumBankFreigabe**************************** */
  const handleZumBankFreigabe = () => {
    navigate("/lastschriftDataGrid");
  };
  /*************handleZumBankFreigabe ends*********************** */
 
  /************handleBezeichnungFilter******************* */
  const handleBezeichnungFilter = (e) => {
    const value = e.target.value;
    const newDataState = {
      ...dataState,
      filter: {
        logic: "and",
        filters: value
          ? [{ field: "Bezeichnung", operator: "contains", value }]
          : [],
      },
    };
    setDataState(newDataState);
    setResult(
      processWithGroups(
        mockkundenop.map((item) => ({
          ...item,
          ["selected"]: currentSelectedState[idGetter(item)],
        })),
        newDataState
      )
    );
  };
  /************handleBezeichnungFilter Ends******************* */
  /************handlePaymentTypeFilter************************** */
  const paymentTypes = [
    { text: "", value: "" },
    { text: "fällige Bankeinzüge", value: "fällige Bankeinzüge" },
    { text: "Überweisung", value: "Überweisung" },
    { text: "AuslandÜberweisung", value: "AuslandÜberweisung" },
    { text: "Ausgeblendete", value: "Ausgeblendete" },
  ];
  const handlePaymentTypeFilter = (e) => {
    const selectedValue = e.target.value;
    console.log("Selected Filter value", selectedValue);
    let filteredData = [];
    if (selectedValue.value === "fällige Bankeinzüge") {
      filteredData = mockkundenop.filter(
        (item) => item.ZahlungsArt === "E" || item.ZahlungsArt === "A"
      );
    } else if (selectedValue.value === "Überweisung") {
      filteredData = mockkundenop.filter(
        (item) => item.ZahlungsArt === "U" || item.ZahlungsArt === ""
      );
    } else if (selectedValue.value === "AuslandÜberweisung") {
      filteredData = mockkundenop.filter((item) => item.ZahlungsArt === "X");
    } else if (selectedValue.value === "Ausgeblendete") {
      filteredData = mockkundenop.filter((item) => item.ZahlungsArt === "AB");
    } else {
      // If no filter is selected, show all data
      filteredData = result.data;
    }
    // Set the filtered data
    setFilteredData(filteredData);
    console.log("Filtered Data:", filteredData);
    // Update the result state
    setResult(
      processWithGroups(
        filteredData.map((item) => ({
          ...item,
          ["selected"]: currentSelectedState[idGetter(item)],
        })),
        dataState
      )
    );
  };
  useEffect(() => {
    //console.log("Updated newData:", newData);
  }, [newData]);
  /************handlePaymentTypeFilter ENDS************************** */
  const sumBetragBeforeToday = (data) => {
    const today = new Date();
    return data.reduce((sum, entry) => {
      return (entry.Faellig && new Date(entry.Faellig) < today) ? sum + entry.Betrag : sum;
    }, 0);
  }
  const totalBetragBeforeToday = sumBetragBeforeToday(mockkundenop);
  console.log("Total Betrag before today:", totalBetragBeforeToday);
  const sumBetrag = mockkundenop.reduce((total, item) => total + item.Betrag, 0);
/************EDIT FORM FOR BANK************************** */
const [openForm, setOpenForm] = useState(false);
const enterEdit = () => {
  setOpenForm(true);
};
const handleCancelEdit = () => {
  setOpenForm(false);
};
const handleSubmit = (event) => {
  // Logic to handle form submission
  Swal.fire({
    icon: "success",
    title: "Erfolgreich aktualisiert",
    text: "Die Bankverbindung wurde erfolgreich aktualisiert. Danke!",
    customClass: {
      confirmButton: "btn-custom-class",
      title: "title-class",
    },
    buttonsStyling: false,
  });
  setOpenForm(false); // Close the edit form after submission
};
/******************EDIT FORM FOR BANK ENDS******************************** */
  return (
    <Box>
      <ExcelExport
        data={result}
        ref={_export}
        onDataStateChange={onDataStateChange}
        {...dataState}
      >
        <Grid
          data={newData}
          pageable={true}
          sortable={true}
          resizable={true}
          reorderable={true}
          groupable={true}
          onExpandChange={onExpandChange}
          expandField="expanded"
          selectedField={"selected"}
          onHeaderSelectionChange={onHeaderSelectionChange}
          onSelectionChange={onSelectionChange}
          onDataStateChange={onDataStateChange}
          dataItemKey="OrginalDVBelegnummer"
          {...dataState}
          total={result.total}
        >
          <GridToolbar>
            <Input
              onChange={handleBezeichnungFilter}
              placeholder="Filter by Bezeichnung"
            />
            <DropDownList
              data={paymentTypes}
              textField="text"
              dataItemKey="value"
              onChange={handlePaymentTypeFilter}
            />
          </GridToolbar>
          <GridToolbar>
            <div className="export-btns-container">
              <Button onClick={excelExport}>Excel export</Button>
            </div>
            <div className="export-btns-container">
              <Button onClick={handleZahlung}>
                Freigegebene Zahlungen ausführen
              </Button>
            </div>
            <div className="export-btns-container">
              <Button onClick={enterEdit}>Bankverbindung ändern</Button>
            </div>
            <div className="export-btns-container">
              <Button onClick={handleZumBankFreigabe}>Zum BankFreigabe</Button>
            </div>
          </GridToolbar>
          <GridColumn field="selected" width={80} />
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
          <GridColumn
            field="SkontoProzent"
            title="SkontoProzent"
            width="150px"
          />
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
          <GridColumn
            field="Letzte Mahnung"
            title="Letzte Mahnung"
            width="150px"
          />
          <GridColumn field="Mahnstufe" title="Mahnstufe" width="150px" />
          <GridColumn
            field="OriginalBetrag"
            title="Original Betrag"
            width="150px"
          />
          <GridColumn field="Notiz" title="Notiz" width="150px" />
          <GridColumn field="Workflows" title="Workflows" width="150px" />
        </Grid>
      </ExcelExport>
      {openForm && (
        <BankChangeForm cancelEdit={handleCancelEdit} onSubmit={handleSubmit} />
      )}
      {/* <div> Sum: {sumBetrag }</div> */}
      {/* <div>Bankeinzuge Sum: {totalBetragBeforeToday }</div> */}
    </Box>
  );
};

export default KundenopDataGrid;
