import React, { useState, useEffect, useCallback, useRef } from "react";
import { Box } from "@mui/material";
import Header from "../../components/Headers"; //TITLE AND SUBTITLE

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
import { Input } from "@progress/kendo-react-inputs";
import { getter } from "@progress/kendo-react-common";

/********ESSENTIAL KENDO REACT GRID COMPONENTS ENDs************************ */
/*********MOCK DATA**************** */
import { mockmahnwesen } from "../../data/mockMahnwesen";
import mockMahnungImage from "../../data/mockMahnungImage.png";
/********************************* */

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

const MahnwesenDataGrid = () => {
  const idGetter = getter("DVBelegnummer");
  const [dataState, setDataState] = useState(initialDataState);
  const [data, setData] = useState([]);
  const [collapsedState, setCollapsedState] = useState([]);
  const [currentSelectedState, setCurrentSelectedState] = useState({}); //OBEJECT
  const [selectedRows, setSelectedRows] = useState([]);
  /*******MOCK DATA********* */
  /*  const [result, setResult] = useState(
    processWithGroups(mockmahnwesen, initialDataState)
  ); */
  /*****************EXTERNAL API DATA BINDING************************************ */
  const [result, setResult] = useState({ data: [], total: 0 });
  //3.
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from your localhost API
        const response = await fetch(
          "https://fibutronwebapi.fibutron.de/api/operation-process/get-mahnung?Mandantnummer=106"
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
  /*******************onDataStateChange************************************* */
  const onDataStateChange = useCallback(
    (event) => {
      //const newDataState = processWithGroups(mockmahnwesen, event.dataState);
      //const newDataState = processWithGroups(data, event.dataState);
      const newDataState = processWithGroups(
        data.map((item) => ({
          ...item,
          ["selected"]: currentSelectedState[idGetter(item)],
        })),
        event.dataState
      );
      setDataState(event.dataState);
      setResult(newDataState);
    },
    [data]
  );
  /*******************onDataStateChange Ends************************************* */
  /************GROUPABLE WITH COLLAPSE AND EXPAND*************************** */
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
  //Update state
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
      const pageDataItems = getCurrentPageDataItems(result.data);
      const checkboxElement = event.syntheticEvent.target;
      const checked = checkboxElement.checked;
  
      // Update selected state for all visible rows
      const newSelectedState = {};
      pageDataItems.forEach((item) => {
        newSelectedState[idGetter(item)] = checked;
      });
      setCurrentSelectedState(newSelectedState);
  
      // Update selectedRows state based on checked status
      if (checked) {
        setSelectedRows(pageDataItems);
      } else {
        setSelectedRows([]);
      }
    },
    [result]
  );
  
  /********************onHeaderSelectionChange ends****************** */
  const onSelectionChange = useCallback(
    (event) => {
      const newSelectedState = getSelectedState({
        event,
        selectedState: currentSelectedState,
        dataItemKey: "DVBelegnummer",
      });
      setCurrentSelectedState(newSelectedState);

      const selectedRow = newSelectedState[idGetter(event.dataItem)]
        ? event.dataItem
        : null;
      setSelectedRows((prevSelectedRows) =>
        selectedRow
          ? [...prevSelectedRows, selectedRow]
          : prevSelectedRows.filter(
              (row) => idGetter(row) !== idGetter(event.dataItem)
            )
      );
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
  /************GROUPABLE WITH COLLAPSE AND EXPAND ENDS*************************** */
  /************handleBezeichnungFilter******************* */
  const handleBezeichnungFilter = (e) => {
    const value = e.target.value;
    const newDataState = {
      ...dataState,
      filter: {
        logic: "and",
        filters: value ? [{ field: "Name1", operator: "contains", value }] : [],
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

  return (
    <Box m="20px">
      <Header
        title="Mahn System"
        subtitle="Hier können Sie die Warnung einsehen"
      />
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
        onSelectionChange={onSelectionChange}
        onHeaderSelectionChange={onHeaderSelectionChange}
        dataItemKey="DVBelegnummer"
        onDataStateChange={onDataStateChange}
        {...dataState}
        total={result.total}
      >
        <GridToolbar>
          <Input
            onChange={handleBezeichnungFilter}
            placeholder="Filter by Bezeichnung"
            style={{width:"190px"}}
          />
        </GridToolbar>
        <GridColumn field="selected" width={80} />
        <GridColumn field="Offener_Betrag" title="Offener Betrag" />
        <GridColumn
          field="Faellig"
          title="Faellig Datum"
          cells={{ data: DateCell }}
          groupable={false}
        />
        <GridColumn field="Name1" title="Name" />
        <GridColumn field="Strasse" title="Strasse" />
        <GridColumn field="PLZ" title="PLZ" />
        <GridColumn field="Ort" title="Ort" />
      </Grid>
      {selectedRows.length > 0 && (
        <Box mt="20px">
          {selectedRows.map((row, index) => (
            <Box key={index}>
              <h3>Preview for: {row.Name1}</h3>
              <img src={mockMahnungImage} alt="Mahnung Preview" width="100%" />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default MahnwesenDataGrid;