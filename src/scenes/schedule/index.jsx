import React, { useState,useEffect } from "react";
import Header from "../../components/Headers";
import { tokens } from "../../theme";
import { Box, useTheme,  } from "@mui/material";

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
import {DataManager, WebApiAdaptor} from '@syncfusion/ej2-data'

registerLicense('Ngo9BigBOggjHTQxAR8/V1NBaF5cWWNCe0x3Q3xbf1x0ZFREalxVTnJXUj0eQnxTdEFjXX5ZcHBXRWNaUEdyVw==');
const Schedule = () => {
  const dataManager = new DataManager({
    url: 'https://fibutronwebapi.fibutron.de/api/calendar/All-Callendars',
    adaptor: new WebApiAdaptor,
    crossDomain: true
});
const data = [ {
  "id": 489684,
  "subject": "",
  "location": "",
  "startTime": "2024-04-11T06:30:00.000Z",
  "endTime": "2024-04-11T07:30:00.000Z",
  "categoryColor": null
},];
const fieldsData = {
  id: 'id',
  subject: { name: 'subject'},
  location: { name: 'location'},
  // description: { name: 'Comments' },
  startTime: { name: 'startTime' },
  endTime: { name: 'endTime' }

}
  return (
    <Box m="20px">
      <Header
        title="Schedule"
        subtitle="Add view and edit you appointments here"
      />
      <ScheduleComponent
        height="650px"
        //eventSettings={{ dataSource: scheduleData }}
         eventSettings={{ dataSource: scheduleData, fields: fieldsData  }}
         selectedDate={new Date(2012,10,12)}
      >
        <Inject
          services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]}
        />
      </ScheduleComponent>
    </Box>
  );
};
export default Schedule;
