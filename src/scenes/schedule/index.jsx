import * as React from "react";
import {
  Box,
  IconButton,
  Typography,
  Modal,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import Header from "../../components/Headers";
import AddIcon from "@mui/icons-material/Add";
import InventoryIcon from "@mui/icons-material/Inventory"; //Archiv
import BarChartIcon from "@mui/icons-material/BarChart";
import PersonIcon from "@mui/icons-material/Person";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { initialGroups } from "./initial"; // import your initial data

const Schedule = () => {
  const navigate = useNavigate();
  const [showAddComponent, setShowAddComponent] = React.useState(null);
  const [groups, setGroups] = React.useState(initialGroups);

  const handleAddGroup = () => {
    setGroups([
      ...groups,
      { name: `Group ${groups.length + 1}`, components: [] },
    ]);
  };

  const handleDeleteGroup = (groupIndex) => {
    setGroups(groups.filter((_, index) => index !== groupIndex));
  };

  const handleAddComponent = (groupIndex) => {
    setShowAddComponent(groupIndex);
  };

  const addComponentToGroup = (groupIndex, component) => {
    const newGroups = [...groups];
    newGroups[groupIndex].components.push(component);
    setGroups(newGroups);
    setShowAddComponent(null);
  };

  const handleComponentClick = (path) => {
    navigate(path);
  };

  const components = [
    { name: "Archiv", icon: <InventoryIcon />, path: "/archiv" },
    { name: "Kunden OP", icon: <PersonIcon />, path: "/kundenop" },
    { name: "Lieferant OP", icon: <BarChartIcon />, path: "/lieferantop" },
    { name: "ArchivKendo", icon: <InventoryIcon />, path: "/archivkendo" },
    // Add more components as needed
  ];

  return (
    <Box m="20px">
      <Header
        title="DASHBOARD"
        subtitle="Herzlich willkommen bei FiBuTronic. Guten Tag!"
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <IconButton onClick={handleAddGroup}>
          <AddIcon />
        </IconButton>
      </Box>
      <Grid container spacing={2}>
        {groups.map((group, groupIndex) => (
          <Grid item xs={12} sm={6} md={4} key={groupIndex}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6">{group.name}</Typography>
                  <Box>
                    <IconButton onClick={() => handleAddComponent(groupIndex)}>
                      <AddIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteGroup(groupIndex)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {group.components.map((component, compIndex) => (
                    <Box
                      key={compIndex}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                      }}
                      onClick={() => handleComponentClick(component.path)}
                    >
                      {component.icon}
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {component.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal for adding components */}
      <Modal
        open={showAddComponent !== null}
        onClose={() => setShowAddComponent(null)}
        aria-labelledby="add-component-modal"
        aria-describedby="add-component-to-group"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" mb={2}>
            Add Component
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {components.map((component, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
                onClick={() => addComponentToGroup(showAddComponent, component)}
              >
                {component.icon}
                <Typography variant="body2" sx={{ ml: 1 }}>
                  {component.name}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Schedule;
