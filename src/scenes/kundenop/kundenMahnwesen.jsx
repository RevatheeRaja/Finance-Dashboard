import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { Button } from "@progress/kendo-react-buttons";
const KundenMahnwesen = () => {
    const handleMahnwesen = () =>{

    }
  return (
  <Box>
     <div className="export-btns-container">
        <Button onClick={handleMahnwesen} style={{ width: '100%' , margin:'30px 0'}}>Mahnwesen</Button>
      </div> 
  </Box>
  )
}

export default KundenMahnwesen