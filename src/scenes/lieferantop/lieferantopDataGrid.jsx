import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; //Alerts
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
import { Input } from "@progress/kendo-react-inputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
/********ESSENTIAL KENDO REACT GRID COMPONENTS ENDS************************ */
import VerbindungDataGrid from "./verbindungDataGrid";
import { addSelectedRows, resetDeletedRows } from "./dataStore"; //Datastore to hanlde intermediate arrays for add & delete selected rows
//EDIT FORM FOR EDITING THE ROW
import BankChangeForm from "./bankChangeForm"; //Edit using external forms
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
  filter: {
    logic: "and",
    filters: [],
  },
};
/*****INITIAL DATA STATE ENDS********** */
const allInEdit = mockverbindlichkeit.map((item) =>
  Object.assign(
    {
      inEdit: true,
    },
    item
  )
);
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
  const EDIT_FIELD = "inEdit";
  const [currentSelectedState, setCurrentSelectedState] = useState({}); //OBEJECT
  const [dataState, setDataState] = React.useState(initialDataState);
  const [collapsedState, setCollapsedState] = useState([]);
  const [updatedData, setUpdatedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  // const [verbindugArray, setVerbindungArray] = useState([])
  //MOCK DATA with Sessions and local storage
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
  /**********REMOTE DATA BINDING************************** */
  /* const [result, setResult] = useState(
    processWithGroups(
      allInEdit.map((item) => ({
        ...item,
        ["selected"]: currentSelectedState[idGetter(item)],
      })),
      initialDataState
    )
  ); */
  /**********REMOTE DATA BINDING ENDS************************** */
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
      //FOR API
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
  /*******************ROW SELECTION ON GRID******************************** */
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
  //Update data after select n group
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
  /*****************onSelectionChange************************** */
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
  /*****************onSelectionChange Ends************************** */
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
  /*******************ROW SELECTION ON GRID ENDS******************************** */

  /*******************HANDLE GRID EXCEL EXPORT**************************** */
  const _export = useRef(null);
  const excelExport = () => {
    if (_export.current !== null) {
      _export.current.save();
      Swal.fire({
        icon: "success",
        title: "Der Export ist erfolgreich",
        text: "Der Excel-Export ist erfolgreich. Bitte schauen Sie in Ihrem Download-Ordner nach, um die Datei zu sehen. Danke!",
        customClass: {
          confirmButton: "btn-custom-class",
          title: "title-class",
        },
        buttonsStyling: false,
      });
    }
  };
  /*******************EXCEL EXPORT ENDS**************************** */

  /*************handleZahlung w/O API****************************** */
  /* const handleZahlung = () => {
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
            } else if (item.interneBelegnummer === key) {
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
                  selected.interneBelegnummer === item.interneBelegnummer
              )
            ) {
              return item;
            }
          }
          return null;
        })
        .filter((item) => item !== null);
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
    navigate("/verbindungDataGrid");
  }; */
  const handleZahlung = async () => {
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
            } else if (item.interneBelegnummer === key) {
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
                  selected.interneBelegnummer === item.interneBelegnummer
              )
            ) {
              return item;
            }
          }
          return null;
        })
        .filter((item) => item !== null);
    };

    const updatedData = removeSelectedItems(result.data);

    console.log("Parent grid data before update:", result.data);
    console.log("Updated data:", updatedData);

    // Step 3: Update the data using the Insert API in POST method
    console.log("Selected items sent in POST request:", selectedItems);
    try {
        const response = await fetch('https://fibutronwebapi.fibutron.de/api/operation-process/insert-verbindlickeit-information?Mandantnummer=923', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedItems),
        });

        if (!response.ok) {
          throw new Error('Failed to update data');
        }

        // Assuming the response contains the updated data
        const responseData = await response.json();

        // Log the response data
        console.log('Response Data:', responseData);

        // Update the state with the updated data
        setResult((prevState) => ({
          ...prevState,
          data: responseData, // Use the updated data from the response
          total: responseData.length, // Assuming the response contains the total count
        }));
    } catch (error) {
        console.error('Error updating data:', error);
        // Handle error
    }

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
    navigate("/verbindungDataGrid");
};

  /************handleZahlung Ends******************* */

  /************handleAppendDeletedRow********************** */
  /**Appends the deleted rows from the child grid back to parent** */
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
    const postData = {
      Mandantnummer: '923',
         // Other data fields as needed
        // For example:
         rowData: dataItem
    }
    // Send a POST request to the backend to insert the row
    fetch('https://fibutronwebapi.fibutron.de/api/operation-process/insert-verbindlickeit-information?Mandantnummer=923', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dataItem),
   // body: JSON.stringify(postData),//use this if Mandatnummer is also needed
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to insert row');
      }
      return response.json();
    })
    .then(data => {
      console.log('Row inserted successfully:', data);
      // Handle success response if needed
    })
    .catch(error => {
      console.error('Error inserting row:', error);
      // Handle error if needed
    });
  };
  /************handleAppendDeletedRow Ends********************** */

  /************handleBezeichnungFilter******************* */
  const handleBezeichnungFilter = (e) => {
    const value = e.target.value;
    const newDataState = {
      ...dataState,
      filter: {
        logic: "and",
        filters: value ? [{ field: "name", operator: "contains", value }] : [],
      },
    };
    setDataState(newDataState);
    setResult(
      processWithGroups(
        mockverbindlichkeit.map((item) => ({
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
      filteredData = mockverbindlichkeit.filter(
        (item) => item.zahlungsart === "E" || item.zahlungsart === "A"
      );
    } else if (selectedValue.value === "Überweisung") {
      filteredData = mockverbindlichkeit.filter(
        (item) => item.zahlungsart === "U" || item.zahlungsart === ""
      );
    } else if (selectedValue.value === "AuslandÜberweisung") {
      filteredData = mockverbindlichkeit.filter(
        (item) => item.zahlungsart === "X"
      );
    } else if (selectedValue.value === "Ausgeblendete") {
      filteredData = mockverbindlichkeit.filter(
        (item) => item.zahlungsart === "AB"
      );
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
  /*******CALUCULATE THE SUM FOR CHART******** */
  const sumBetrag = mockverbindlichkeit.reduce(
    (total, item) => total + item.betrag,
    0
  );
  const sumBankeinzuge = result.data.reduce((total, item) => {
    if (item.zahlungsart === "A" || item.zahlungsart === "E") {
      return total + item.betrag;
    }
    return total;
  }, 0);
  /*******CALUCULATE THE SUM FOR CHART ENDS******** */
  const [data, setData] = React.useState(allInEdit);
  const itemChange = (e) => {
    console.log("edit enabled");
    let newData = data.map((item) => {
      if (item.interneBelegnummer === e.dataItem.interneBelegnummer) {
        return { ...item, [e.field]: e.value };
      }
      return item;
    });
    setData(newData);
    // Update the data state
    setDataState({
      ...dataState,
      data: newData,
    });
  };
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
    <>
      <ExcelExport data={result.data} ref={_export}>
        <Grid
          data={newData}
          groupable={true}
          resizable={true}
          reorderable={true}
          sortable={true}
          onItemChange={itemChange}
          editField="inEdit"
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
            <Input
              onChange={handleBezeichnungFilter}
              placeholder="Filter by Bezeichnung"
              width={140}
            />
            <DropDownList
              data={paymentTypes}
              textField="text"
              dataItemKey="value"
              onChange={handlePaymentTypeFilter}
            />
            <div className="export-btns-container">
              <Button onClick={excelExport}>Excel export</Button> <br />
            </div>
            <div className="export-btns-container">
              <Button onClick={handleZahlung}>
                Freigegebene Zahlungen ausführen
              </Button>
            </div>
            <div className="export-btns-container">
              <Button onClick={enterEdit}>Bankverbindung ändern</Button>
            </div>
          </GridToolbar>
          <GridColumn field="selected" width={80} />
          <GridColumn
            field="betrag"
            title="OP Freigeben"
            width={120}
            editable={false}
            aggregate="sum"
          />
          <GridColumn
            field="betrag"
            title="Betrag Ändern"
            width={150}
            editable={true}
            editor="numeric"
          />
          <GridColumn
            field="belegnummer"
            title="Belegnummer"
            width={200}
            editable={false}
          />
          <GridColumn
            field="interneBelegnummer"
            title="interneBelegnummer"
            width={200}
            editable={false}
          />
          <GridColumn
            field="name"
            title="Bezeichnung"
            width={300}
            editable={false}
          />
          <GridColumn field="text" title="Text" width={200} editable={false} />
          <GridColumn
            field="valuta"
            title="Valuta"
            width={120}
            cells={{ data: DateCell }}
            editable={false}
          />
          <GridColumn
            field="faellig"
            title="Fällig"
            width={120}
            cells={{ data: DateCell }}
            editable={false}
          />
          <GridColumn
            field="skonto1Bis"
            title="SkontoFrist"
            cells={{ data: DateCell }}
            width={120}
            editable={false}
          />
          <GridColumn field="skonto1Prozent" title="Skonto%" editable={false} />
          <GridColumn
            field="saldo"
            title="Saldo"
            width={120}
            editable={false}
          />
          <GridColumn
            field="ibanNummer"
            title="IBAN"
            width={120}
            editable={false}
          />
          <GridColumn
            field="swifT_Adr"
            title="BIC"
            width={120}
            editable={false}
          />
          <GridColumn
            field="belegdatum"
            title="Belegdatum"
            width={120}
            cells={{ data: DateCell }}
            editable={false}
          />
          <GridColumn
            field="kdNrBeiKreditor"
            title="KdNrBeiKreditor"
            width={120}
            editable={false}
          />
        </Grid>
      </ExcelExport>
      {/* <div>Total Betrag: {sumBetrag}</div>
      <div>Bankeinzuge Sum: {sumBankeinzuge}</div> */}
      {/* <VerbindungDataGrid onAppendDeletedRow={handleAppendDeletedRow} /> */}
      {openForm && (
        <BankChangeForm cancelEdit={handleCancelEdit} onSubmit={handleSubmit} />
      )}
    </>
  );
};

export default LieferantopDataGrid;
