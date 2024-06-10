import React from 'react'
import { Box} from "@mui/material";
import Header from "../../components/Headers"; //TITLE AND SUBTITLE 
import { TileLayout } from '@progress/kendo-react-layout'
import LieferantopDataGrid from './lieferantopDataGrid.jsx'
import LieferantopChart from './lieferantopChart.jsx'
import LieferantopForm from './lieferantopForm.jsx'
const Lieferantop = () => {
  const [data, setData] = React.useState([
   {
      col: 1,
      colSpan: 2,
      rowSpan: 2,
    },
    {
      col: 3,
      colSpan: 3,
      rowSpan: 2,
    },
    {
      col:1,
      colSpan:5,
      rowSpan:3
    },
  ]);
  const tiles = [
    {
      header: 'Konto Informationen',
      body: <LieferantopForm/>,
      reorderable: true,
    },
    {
      header: 'Transaktionsübersicht',
      body: <LieferantopChart/>,
      reorderable: true,
    },
    {
      header: 'Transaktions Data',
      body: <LieferantopDataGrid/>,
      reorderable: false,
    },
  ]
  return (
    <Box m="20px">
      <Header title="Lieferant OP" subtitle="Supplier Open Positions" />
      <TileLayout
        columns={5}
        rowHeight={255}
        positions={data}
        gap = {{
          rows:12,
          columns:12
        }}
        items={tiles}
      />
    </Box>
  )
}

export default Lieferantop