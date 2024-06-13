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
import { addSelectedRows, resetDeletedRows } from "./dataStore";
/********DUMMY DATA FOR TEST****************** */
import { mockverbindlichkeit } from "../../data/mockverbindlichkeit";
//EDIT FORM FOR EDITING THE ROW
import BankChangeForm from "./bankChangeForm"; //Edit using external forms
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
  take: 5,
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
  const [updatedData, setUpdatedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  //MOCK DATA
  /* const [result, setResult] = React.useState(
    processWithGroups(
      mockverbindlichkeit.map((item) => ({
        ...item,
        ["selected"]: currentSelectedState[idGetter(item)],
      })),
      initialDataState
    )
  ); */

  /*****************EXTERNAL API DATA BINDING************************************ */
  const [result, setResult] = useState({ data: [], total: 0 });
  //3.
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from your localhost API
        const response = await fetch(
          "https://fibutronwebapi.fibutron.de/api/operation-process/get-verbindlichkeit-inforamtion?Mandantnummer=100"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setData(data);
        setResult(
          processWithGroups(
            data.map((item) => ({
              ...item,
              ["selected"]: currentSelectedState[idGetter(item)],
            })),
            dataState
          )
        );
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
      /*  const newDataState = processWithGroups(
        mockverbindlichkeit.map((item) => ({
          ...item,
          ["selected"]: currentSelectedState[idGetter(item)],
        })),
        e.dataState
      ); */
      const newDataState = processWithGroups(
        data.map((item) => ({
          ...item,
          ["selected"]: currentSelectedState[idGetter(item)],
        })),
        e.dataState
      );
      //const newDataState = processWithGroups(data, e.dataState);
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
  /**************handleZahlung as backup********************** */
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
        // Display success message
    };
    const updatedData = removeSelectedItems(result.data);
    console.log("Parent grid data before update:", result.data);
    console.log("Updated data:", updatedData);
    //maybe i give the post request here to update the api about the change, but would need some groundwork

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
        data.map((item) => ({
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
      filteredData = data.filter(
        (item) => item.zahlungsart === "E" || item.zahlungsart === "A"
      );
    } else if (selectedValue.value === "Überweisung") {
      filteredData = data.filter(
        (item) => item.zahlungsart === "U" || item.zahlungsart === ""
      );
    } else if (selectedValue.value === "AuslandÜberweisung") {
      filteredData = data.filter((item) => item.zahlungsart === "X");
    } else if (selectedValue.value === "Ausgeblendete") {
      filteredData = data.filter((item) => item.zahlungsart === "AB");
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

  /*********************DONT DELETE just commenting out. this handles the post request and must be uncommented when pushed on live*********************** */
  /**************HANDLE ZAHLUNG AND HANDLE DELETE WITH API FOR LIVE PUSH************************************************* */
  /*************API WITH POST METHOD****************************** */
  /* const filterDataForApi = (item) => {
    return {
      belegnummer: String(item.belegnummer),
      text: item.text || "null",
      betrag: String(item.betrag),
      valuta: item.valuta,
      faellig: item.faellig,
      skonto1Bis: item.skonto1Bis,
      skonto1Prozent: String(item.skonto1Prozent),
      saldo: String(item.saldo),
      dvBuchungsnummer: String(item.dvBuchungsnummer),
      zahlBANK: item.zahlBANK,
      zahlBLZ: item.zahlBLZ,
      auftraggeber: item.auftraggeber,
      belegdatum: item.belegdatum,
      kontonummer: item.kontonummer.trim(),
      status: item.status || "",
    };
  };
  const handleZahlung = async () => {
    console.log("Handle zahlung is pressed");
    //Step 1: Get the selected rows based on the current selected state
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
    // Step 3: Transform the data for API
    const apiData = updatedData.map(filterDataForApi);
    console.log("API Data:", apiData);

    // Step 4: Update the API with the updated data
    try {
      const response = await fetch(
        "https://fibutronwebapi.fibutron.de/api/operation-process/insert-verbindlickeit-information?Mandantnummer=923",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(apiData[0]), // Send the updated data to the server
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update data on the server: ${errorText}`);
      }

      // Assuming the response contains the updated data
      const responseData = await response.json();

      // Step 7: Optionally, update the UI with the response data
      // For example, setResult(responseData) or any other appropriate action
      console.log("Response Data:", responseData);
      // Update the state or perform any other actions as needed
      setResult(responseData);
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
      console.log(
        "Parent grid data after removing selected rows:",
        updatedData
      );
      // Step 5: Add selected rows to child grid
      addSelectedRows(selectedItems);
    } catch (error) {
      console.error("Error updating data:", error);
      // Handle error
    }
  }; */

  /*  const handleAppendDeletedRow = async (dataItem) => {
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

    // Transform the appended data for API
    const apiData = filterDataForApi(dataItem);
    console.log("API Data for appending deleted row:", apiData);

    // Send POST request to update the API with the appended data
    try {
        const response = await fetch('https://fibutronwebapi.fibutron.de/api/operation-process/insert-verbindlickeit-information?Mandantnummer=923', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([apiData]), // Send the transformed data to the server
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to update data on the server: ${errorText}`);
        }

        // Assuming the response contains the updated data
        const responseData = await response.json();

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
}; */

  /************handleAppendDeletedRow Ends********************** */

  /**************handleBank********************** */
  const handleBank = () => {
    console.log("Bank Button pressed");
  };
  /************handleBank Ends******************* */
  /**************ZUM BANKFREIGABE BUTTON**************************** */
  const handleZumBankFreigabe = () => {
    navigate("/verbindungDataGrid");
  };
  /**************ZUM BANKFREIGABE BUTTON ENDS**************************** */
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
      {/* <VerbindungDataGrid onAppendDeletedRow={handleAppendDeletedRow} />  */}
      {openForm && (
        <BankChangeForm cancelEdit={handleCancelEdit} onSubmit={handleSubmit} />
      )}
    </>
  );
};

export default LieferantopDataGrid;
