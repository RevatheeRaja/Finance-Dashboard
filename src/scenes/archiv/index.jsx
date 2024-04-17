import { Box, Typography, useTheme } from "@mui/material";
//DataGrid for table and gritoolbar is the toolbar on top of the table for some options like export, columns and filters.
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { ColorModeContext, tokens } from "../../theme";
import { mockData } from "../../data/mockData";
// import { makeStyles } from "@mui/styles";
import Header from "../../components/Headers";

//import few icons if needed

const Archiv = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // bring in the columns from the data pair in json
  const columns = [
    { field: "id", headerName: "ID" },
    {
      field: "thema",
      headerName: "Thema",
      width: 150,
      cellClassName: "thema-column--cell",
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      cellClassName: "name-column--cell",
    },
    {
      field: "strasse",
      headerName: "Strasse",
      width: 100,
      cellClassName: "strasse-column--cell",
    },
    { field: "ort", headerName: "Ort", cellClassName: "ort-column--cell" },
    {
      field: "vorgangsart",
      headerName: "Vorgangsart",
      cellClassName: "vorgangsart-column--cell",
    },
    {
      field: "belegnummer",
      headerName: "Belegnummer",
      width: 100,
      cellClassName: "belegnummer-column--cell",
    },
    {
      field: "partnerkategorie",
      headerName: "Partnerkategorie",
      cellClassName: "partnerkategorie-column--cell",
    },
    {
      field: "kundenliefkonto",
      headerName: "Konto",
      type: "number",
      headerAlign: "left",
      align: "left",
      cellClassName: "kundenliefkonto-column--cell",
    },
    {
      field: "stichwort",
      headerName: "Projekt",
      width: 100,
      cellClassName: "stichwort-column--cell",
    },
    {
      field: "dokumentendatum",
      headerName: "Datum",
      width: 150,
      cellClassName: "dokumentendatum-column--cell",
    },
    {
      field: "barcode",
      headerName: "Barcode",
      type: "number",
      headerAlign: "left",
      align: "left",
      cellClassName: "barcode-column--cell",
    },
    {
      field: "notizen",
      headerName: "Notizen",
      width: 200,
      cellClassName: "notizen-column--cell",
    },
    {
      field: "seitenzahl",
      headerName: "Seiten",
      flex: 1,
      cellClassName: "seitenzahl-column--cell",
    },
  ];

  return (
    <Box>
      <Header title="ARCHIV" subtitle="Belge Verwalte"></Header>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          // "& .name-column--cell": {
          //   color: colors.greenAccent[300],
          // },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-row": {
            "&:nth-of-type(2n)": {
              backgroundColor: colors.primary[300],
            },
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.indigo[100],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[200]} !important`,
          },
        }}
      >
        <DataGrid
          rows={mockData}
          columns={columns}
          slots={{ toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};
export default Archiv;
