import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { mockAufgabenData } from "../../data/mockAufgaben";
const TodoTask = () => {
  const [openTasks, setOpenTasks] = useState([]);
  const [openTaskCount, setOpenTaskCount] = useState(0);
  useEffect(() => {
    const filteredTasks = mockAufgabenData.filter(
      (task) => task.Status === "Open"
    );
    setOpenTasks(filteredTasks);
    setOpenTaskCount(filteredTasks.length);
  }, []);

  return (
    <Box>
      <Box>
        <h2 style={{
        fontSize: "13px",
      }}>Sie haben {openTaskCount} Aufgaben zu erledigen</h2>
      </Box>
      {openTasks.map((task) => (
        <Box
          key={task.Id}
          mt={2}
          p={2}
          style={{
            cursor: "pointer",
            backgroundColor: task.Color,
            borderRadius: "4px",
            padding: "10px",
            marginBottom: "10px",
          }}
          className={task.ClassName}
        >
          {task.Summary}
        </Box>
      ))}
    </Box>
  );
};

export default TodoTask;
