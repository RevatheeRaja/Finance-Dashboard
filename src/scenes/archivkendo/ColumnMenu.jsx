
import React, { useState, useEffect } from "react";
import { GridColumnMenuFilter, GridColumnMenuCheckboxFilter } from '@progress/kendo-react-grid';
//dummy data
import { mockData } from "../../data/mockData";

/***********API DATABINDING**************/
const API_ENDPOINT = "https://fibutronwebapi.fibutron.de/Archiv?MandantNr=923";
 //2. set the state for the data
 

export const ColumnMenu = props => {
  return <div>
        <GridColumnMenuFilter {...props} expanded={true} />
      </div>;
};
export const ColumnMenuCheckboxFilter = props => {
  const [rowData, setRowData] = useState([]);
 //3.
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from your localhost API
        const response = await fetch(API_ENDPOINT);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setRowData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

   fetchData();
  }, []);
  return <div>
        <GridColumnMenuCheckboxFilter {...props} data={rowData} expanded={true} />
      </div>;
};