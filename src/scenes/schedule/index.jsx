import React, { useState } from "react";
import Header from "../../components/Headers";
import { tokens } from "../../theme";
import { Box, useTheme } from "@mui/material";

//import Dummy data
import { scheduleData } from "../../data/mockSchedule";
//import components from @syncfusion
import {
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
  Resize,
  DragAndDrop,
} from "@syncfusion/ej2-react-schedule";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense('Ngo9BigBOggjHTQxAR8/V1NBaF5cWWNCe0x3Q3xbf1x0ZFREalxVTnJXUj0eQnxTdEFjXX5ZcHBXRWNaUEdyVw==');
const Schedule = () => {
  
  return (
    <Box m="20px">
      <Header
        title="Schedule"
        subtitle="Add view and edit you appointments here"
      />
      <ScheduleComponent
        height="650px"
        eventSettings={{ dataSource: scheduleData }}
        selectedDate={new Date(2024,3,12)}
      >
        <Inject
          services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]}
        />
      </ScheduleComponent>
    </Box>
  );
};
export default Schedule;
