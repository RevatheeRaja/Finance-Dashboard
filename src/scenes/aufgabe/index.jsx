import React, { useState } from "react";
import {
  Box,
  Button,
} from "@mui/material";
import Header from "../../components/Headers";
import {
  KanbanComponent,
  ColumnsDirective,
  ColumnDirective,
} from "@syncfusion/ej2-react-kanban";
import { mockAufgabenData, mockAufgabenGrid } from "../../data/mockAufgaben";
import { dialogTemplate } from "./dialogTemplate";

const Aufgabe = () => {
  let kanbanObj;
  const [selectedTask, setSelectedTask] = useState(null);
  const openDialog = (type, task = null) => {
    console.log("Task:", task); // Log the value of task
    kanbanObj.openDialog(type);
    if (type === "Edit" && task) {
      // Populate dialog fields with details of the selected task
      document.getElementById("Id").value = task.Id;
      document.getElementById("Status").value = task.Status;
      document.getElementById("Assignee").value = task.Assignee;
      document.getElementById("Priority").value = task.Priority;
      document.getElementById("Summary").value = task.Summary;
    } else {
      // Reset dialog fields for adding a new task
      document.getElementById("Id").value = "";
      document.getElementById("Status").value = "";
      document.getElementById("Assignee").value = "";
      document.getElementById("Priority").value = "";
      document.getElementById("Summary").value = "";
    }
  };
  const handleAddCard = () => {
    setSelectedTask(null);
    openDialog("Add");
  };

  const handleEditCard = (task) => {
    if (task) {
      setSelectedTask(task);
      openDialog("Edit", task);
    } else {
      console.error("Task is null or undefined");
    }
  };
  

  return (
    <Box m="20px">
      <Header title="Aufgaben" subtitle="View all the To-Do here" />
      <Button variant="contained" onClick={handleAddCard}>
        Add Card
      </Button>
      <KanbanComponent
        id='kanban'
        dataSource={mockAufgabenData}
        cardSettings={{
          headerField: 'Id',
          contentField: 'Summary',
          grabberField: "Color",
        }}
        dialogSettings={{
          template: dialogTemplate,
        }}
        
        ref={(e) => { kanbanObj = e; }}
        actionBegin={(args) => {
          if (args.requestType === "beforeOpen") {
            // Clear any previous selection
            setSelectedTask(null);
          }
        }}
        cardClick={(args) => {
          // Handle card click to open edit dialog
          const task = args.data;
          handleEditCard(task);
        }}
        keyField="Status"
      >
        <ColumnsDirective>
          {mockAufgabenGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
      </KanbanComponent>
    </Box>
  );
};

export default Aufgabe;
