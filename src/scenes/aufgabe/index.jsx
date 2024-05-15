import React, { useState } from "react";
import { Box, Button } from "@mui/material";
import Header from "../../components/Headers";
import {
  KanbanComponent,
  ColumnsDirective,
  ColumnDirective,
} from "@syncfusion/ej2-react-kanban";
import { mockAufgabenData, mockAufgabenGrid } from "../../data/mockAufgaben";
import { dialogTemplate } from "./dialogTemplate";

const Aufgabe = () => {
  return (
    <Box m="20px">
      <Header title="Aufgaben" subtitle="View all the To-Do here" />
      <Button variant="contained">Add Card</Button>
      <KanbanComponent
        id="kanban"
        keyField="Status"
        dataSource={mockAufgabenData}
        cardSettings={{
          contentField: "Summary",
          headerField: "Id",
          grabberField: "Color",
        }}
      >
        <ColumnsDirective>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {mockAufgabenGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
      </KanbanComponent>
    </Box>
  );
};

export default Aufgabe;
