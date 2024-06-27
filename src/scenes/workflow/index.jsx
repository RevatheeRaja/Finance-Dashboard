import * as React from "react";
import * as ReactDOM from "react-dom";
import Header from "../../components/Headers"; //TITLE AND SUBTITLE
import { Box } from "@mui/material";
import { TaskBoard, TaskBoardToolbar } from "@progress/kendo-react-taskboard";
import { Button } from "@progress/kendo-react-buttons";
import { Input } from "@progress/kendo-react-inputs";
import { filterBy } from "@progress/kendo-data-query";
import { mockAufgabenData } from "../../data/mockAufgaben";

/* const tasks = mockAufgabenData.map((c) => ({
  id: c.Id,
  title: c.Title,
  description: c.Summary,
  status: c.Status,
  priority: c.Priority,
  assignee: c.Assignee,
})); */
const tasks = mockAufgabenData.map((c) => ({
  id: c.id,
  title: c.title,
  description: c.description,
  status: c.status,
  priority: c.priority,
})); 
const columns = [
  {
    id: 1,
    title: "To-Do",
    status: "todo",
  },
  {
    id: 2,
    title: "In Progress",
    status: "done",
  },
  {
    id: 3,
    title: "Review",
    status: "inProgress",
  },
  {
    id: 4,
    title: "Test",
    status: "Validate",
  },
  {
    id: 5,
    title: "Closed",
    status: "Close",
  },
];
const priorities = [
  {
    priority: "Low",
    color: "green",
  },
  {
    priority: "High",
    color: "blue",
  },
  {
    priority: "Normal",
    color: "yellow",
  },
  {
    priority: "Critical",
    color: "orange",
  },
];
const Workflow = () => {
  const [filter, setFilter] = React.useState("");
  const [taskData, setTaskData] = React.useState(tasks);
  const [columnsData, setColumnsData] = React.useState(columns);
  const onSearchChange = React.useCallback((event) => {
    setFilter(event.value);
  }, []);
  const resultTasks = React.useMemo(() => {
    const filterDesc = {
      logic: "and",
      filters: [
        {
          field: "title",
          operator: "contains",
          value: filter,
        },
      ],
    };
    return filter ? filterBy(taskData, filterDesc) : taskData;
  }, [filter, taskData]);
  const onChangeHandler = React.useCallback((event) => {
    if (event.type === "column") {
      setColumnsData(event.data);
    } else {
      // New Task has been added.
      if (event.item && event.item.id === undefined) {
        event.item.id = event.data.length + 1;
      }
      setTaskData(event.data);
    }
  }, []);
  const onAddColumn = () => {
    const newColumn = {
      id: columnsData.length + 1,
      title: "New Column",
      status: "new",
      edit: true,
    };
    setColumnsData([...columnsData, newColumn]);
  };
  return (
    <TaskBoard
      columnData={columnsData}
      taskData={resultTasks}
      priorities={priorities}
      onChange={onChangeHandler}
      style={{
        height: "700px",
      }}
      tabIndex={0}
    >
      <TaskBoardToolbar>
        <Button icon="add" onClick={onAddColumn}>
          Add Column
        </Button>
        <span className="k-spacer" />
        <Input
          placeholder="Search..."
          onChange={onSearchChange}
          value={filter}
        />
      </TaskBoardToolbar>
      
    </TaskBoard>
  );
};
export default Workflow;
