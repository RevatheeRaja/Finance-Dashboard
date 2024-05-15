import * as React from 'react';
import { GridColumnMenuFilter, GridColumnMenuCheckboxFilter } from '@progress/kendo-react-grid';
//dummy data
import { mockData } from "../../data/mockData";
export const ColumnMenu = props => {
  return <div>
        <GridColumnMenuFilter {...props} expanded={true} />
      </div>;
};
export const ColumnMenuCheckboxFilter = props => {
  return <div>
        <GridColumnMenuCheckboxFilter {...props} data={mockData} expanded={true} />
      </div>;
};