import React, { useState, useEffect, useCallback, useRef } from "react";
import { Box, useTheme } from "@mui/material";

import Header from "../../components/Headers"; //TITLE AND SUBTITLE FOR EVERY PAGE
/**IMPORT COLOR TOKENS AND THEMES */
import { ColorModeContext, tokens } from "../../theme";

/********ESSENTIAL KENDO REACT GRID COMPONENTS************************ */
import { Grid, GridColumn, GridToolbar } from "@progress/kendo-react-grid";
import { ColumnMenu, ColumnMenuCheckboxFilter } from "./ColumnMenu";
import { process } from "@progress/kendo-data-query";
import {
  setGroupIds,
  getGroupIds,
  setExpandedState,
} from "@progress/kendo-react-data-tools";
import { ExcelExport } from "@progress/kendo-react-excel-export";
import { Button } from "@progress/kendo-react-buttons";
import "@progress/kendo-theme-material/dist/all.css";
/********ESSENTIAL KENDO REACT GRID COMPONENTS ENDS************************ */

//EDIT FORM FOR EDITING THE ROW
import EditForm from "./editForm"; //Edit using external forms

/*****ICONS SECTION FROM MATERIAL UI ICONS******** */
import DownloadIcon from "@mui/icons-material/Download";
import ModeRoundedIcon from "@mui/icons-material/ModeRounded";
/************************** */

/********DUMMY DATA FOR TEST****************** */
import { mockData } from "../../data/mockData";
import mockPDF from "../../data/mockPDF.pdf";
/************* */

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
/**processes the data with grouing as well */

const processWithGroups = (data, dataState) => {
  const newDataState = process(data, dataState);
  setGroupIds({
    data: newDataState.data,
    group: dataState.group,
  });
  return newDataState;
};
/***********PROCESSWITHGROUPS ENDS********************** */
const Archivkendo = () => {
  //color theme
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [dataState, setDataState] = useState(initialDataState);
  const [collapsedState, setCollapsedState] = useState([]);
  //mock data
  //const [result, setResult] = useState(processWithGroups(mockData, initialDataState));

  /*****************EXTERNAL API DATA BINDING************************************ */
  const [result, setResult] = useState({ data: [], total: 0 });
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://fibutronwebapi.fibutron.de/Archiv?MandantNr=923"
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
  }, [dataState]);
  /***************************DATA BINDING ENDS*******************************************************/

  /**********************ONDATASTATECHANGE*************************************************** */
  const onDataStateChange = useCallback(
    (event) => {
      //const newDataState = processWithGroups(mockData, event.dataState);
      const newDataState = processWithGroups(data, event.dataState);
      setDataState(event.dataState);
      setResult(newDataState);
    },
    [data]
  );

  /**********************ONDATASTATECHANGE ENDS*************************************************** */

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
  /***************GROUPING WITH EXPAND AND COLLAPSE FUNCTIONS*********************** */

  /*******************HANDLE EXCEL EXPORT ON DATAGRID TOOLBAR********************************** */
  const _export = useRef(null);
  const excelExport = () => {
    if (_export.current !== null) {
      _export.current.save();
    }
  };
  /*******************HANDLE EXCEL EXPORT ON DATAGRID TOOLBAR ENDS********************************** */

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
    } catch (error) {
      console.error("error downloading the file");
    }
  };

  //Download invoice/PDF template
  const template = (props) => {
    return (
      <td {...props.tdProps}>
        <DownloadIcon onClick={handlePdfDownload} id="pdfDownload" />
      </td>
    );
  };
  /*******************HANDLE INVOICE DOWNLOAD ON EVERY ROW ENDS********************************** */

   /****EDIT ROW WITH EXTERNAL FORMS******** */
   const [openForm, setOpenForm] = React.useState(false);
   const [editItem, setEditItem] = React.useState({
     id: 1,
   });
 
   const enterEdit = (item) => {
     setOpenForm(true);
     setEditItem(item);
   };
   const handleCancelEdit = () => {
     setOpenForm(false);
   };
   const handleSubmit = (event) => {
     let newData = data.map((item) => {
       if (event.id === item.id) {
         item = {
           ...event,
         };
       }
       return item;
     });
     setData(newData); // Update the data state with the new data
     setResult(process(newData, dataState)); // Update the result state with processed data
     setOpenForm(false); // Close the edit form
   };
   const EditCommandCell = (props) => {
     return (
       <td {...props.tdProps}>
         <ModeRoundedIcon
           onClick={() => props.enterEdit(props.dataItem)}
           id="edit"
         />
       </td>
     );
   };
   const MyEditCommandCell = (props) => (
     <EditCommandCell {...props} enterEdit={enterEdit} />
   );
   /***********************EDIT EXTERNAL FORM ENDS************************************* */

   /************************MARKIERUNG TEMPLATE******************************************************* */
   let loc = { width: "31px", height: "24px" };
   const markTemplate = (props) => {
     const { dataItem } = props;
     let MarkImage =
       // console.log("props.markierung:", props.dataItem.markierung);
       props.dataItem.markierung === "Important"
         ? `${process.env.PUBLIC_URL}/assets/image/important.png`
         : props.dataItem.markierung === "Read"
         ? `${process.env.PUBLIC_URL}/assets/image/readCategory.png`
         : props.dataItem.markierung === "Green Category"
         ? `${process.env.PUBLIC_URL}/assets/image/greenCategory.png`
         : props.dataItem.markierung === "Blue Category"
         ? `${process.env.PUBLIC_URL}/assets/image/blueCategory.png`
         : props.dataItem.markierung === "Red Category"
         ? `${process.env.PUBLIC_URL}/assets/image/redCategory.png`
         : null;
     // console.log(MarkImage)
     return (
       <td {...props.tdProps}>
         {MarkImage && <img style={loc} src={MarkImage} alt="" />}
         {/* <span id="Marktext">{props.markierung}</span> */}
       </td>
     );
   };
   /************************MARKIERUNG TEMPLATE ENDS******************************************************* */

  return (
    <Box>
      <Header title="ARCHIV" subtitle="Datagrid using Kendo"></Header>
      <Box m="40px 0 0 0"
        height="75vh"
        sx={{
          "&. k-table-tbody": {
            backgroundColor: colors.grey[100],
          },
          "& .k-table-row": {
            "&:nth-of-type(2n)": {
              //backgroundColor: `${theme.palette.mode ==="dark" ? colors.grey[100]:colors.blueAccent[200]}`,
              backgroundColor: colors.primary[300],
            },
          },
        }}>
      <ExcelExport data={result.data} ref={_export} onDataStateChange={onDataStateChange}
    
          {...dataState}>
        <Grid
          data={newData}
          sortable={true}
          groupable={true}
          resizable={true}
          pageable={{ pageSizes: true }}
          reorderable={true}
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
          <GridColumn
            // field=" "
            title="Download"
            width="90px"
            cells={{ data: template }}
          />
          <GridColumn title="Edit" width="90px" cell={MyEditCommandCell} />
          <GridColumn
            field="markierung"
            title="Markierung"
            width="150px"
            cells={{ data: markTemplate }}
            columnMenu={ColumnMenuCheckboxFilter}
          />
          <GridColumn
            field="id"
            title="Id"
            width="150px"
            filter={"numeric"}
            columnMenu={ColumnMenu}
          />
          <GridColumn
            field="thema"
            title="Thema"
            width="150px"
            columnMenu={ColumnMenuCheckboxFilter}
          />
          <GridColumn
            field="name"
            title="Name"
            width="250px"
            columnMenu={ColumnMenuCheckboxFilter}
          />
          <GridColumn
            field="strasse"
            title="Strasse"
            width="150px"
            columnMenu={ColumnMenuCheckboxFilter}
          />
          <GridColumn
            field="ort"
            title="Ort"
            width="180px"
            columnMenu={ColumnMenuCheckboxFilter}
          />
          <GridColumn
            field="vorgangsart"
            title="Vorgangsart"
            width="200px"
            columnMenu={ColumnMenuCheckboxFilter}
          />
          <GridColumn
            field="belegnummer"
            title="Belegnummer"
            width="200px"
            filter={"numeric"}
            columnMenu={ColumnMenu}
          />
          <GridColumn
            field="partnerkategorie"
            title="Partnerkategorie"
            width="120px"
            columnMenu={ColumnMenuCheckboxFilter}
          />
          <GridColumn
            field="kundenliefkonto"
            title="Konto"
            width="100px"
            columnMenu={ColumnMenuCheckboxFilter}
          />
          <GridColumn
            field="stichwort"
            title="Projekt"
            width="100px"
            columnMenu={ColumnMenuCheckboxFilter}
          />
          <GridColumn
            field="dokumentendatum"
            title="Datum"
            width="200px"
            columnMenu={ColumnMenuCheckboxFilter}
          />
          <GridColumn
            field="barcode"
            title="Barcode"
            width="100px"
            filter={"numeric"}
            columnMenu={ColumnMenu}
          />
          <GridColumn
            field="notizen"
            title="Notizen"
            width="100px"
            columnMenu={ColumnMenuCheckboxFilter}
          />
          <GridColumn field="seitenzahl" title="Seiten" width="100px" />
        </Grid>
        {
            /*********OVERWRITE THE STYLING OF THE DATA GRID******* */
            <style>
              {`
             .k-table-thead{
                 background :${
                   theme.palette.mode === "dark"
                     ? colors.indigo[100]
                     : colors.blueAccent[200]
                 };
               }
               .k-column-title {
                 color: ${theme.palette.mode === "dark" ? "white" : "darkblue"}
               } 
               .k-column-title:hover {
                 color: ${theme.palette.mode === "dark" ? "#dfe6f5" : "#010169"}
               } 
               .k-svg-i-more-vertical {
                 color: ${theme.palette.mode === "dark" ? "white" : "darkblue"}
               }
               .k-svg-i-more-vertical:hover {
                 color: ${theme.palette.mode === "dark" ? "#dfe6f5" : "#010169"}
               }
         `}
            </style>
            /*********END STYLE OVERWRITING******* */
          }
         {/**OPEN THE EXTERNAL FORM/DIALOG BOX *******************/}
         {openForm && (
            <EditForm
              cancelEdit={handleCancelEdit}
              onSubmit={handleSubmit}
              item={editItem}
            />
          )}
          {/* END EXTERNAL FORM/DIALOG BOX */}
      </ExcelExport>
      </Box>
    </Box>
  );
};
export default Archivkendo;
