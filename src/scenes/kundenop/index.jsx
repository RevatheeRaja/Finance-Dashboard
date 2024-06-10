import React from 'react'
import { Box} from "@mui/material";
import Header from "../../components/Headers"; //TITLE AND SUBTITLE 
import { TileLayout } from '@progress/kendo-react-layout'
import KundenopChart from './kundenopChart'
import KundenopDataGrid from './KundenopDataGrid'
import KundenopForm from './kundenopForm'
const Kundenop = () => {
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
      body: <KundenopForm/>,
      reorderable: true,
    },
    {
      header: 'Transaktionsübersicht',
      body: <KundenopChart/>,
      reorderable: true,
    },
    {
      header: 'Transaktions Data',
      body: <KundenopDataGrid/>,
      reorderable: false,
    },
  ]
  return (
    <Box m="20px">
      <Header title="Kunden OP" subtitle="Kunden Open Positions" />
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

export default Kundenop