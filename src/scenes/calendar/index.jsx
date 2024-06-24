import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  Scheduler,
  DayView,
  MonthView,
  WeekView,
  WorkWeekView,
  AgendaView,
  SchedulerItem,
  TimelineView,
  SchedulerViewSlot 
} from "@progress/kendo-react-scheduler";
import { Day } from "@progress/kendo-date-math";
import { guid } from "@progress/kendo-react-common";
import Header from "../../components/Headers"; //TITLE AND SUBTITLE
import { Box } from "@mui/material";
import { mockAppointments } from "../../data/mockCalendar";

const currentYear = new Date().getFullYear();
const parseAdjust = (eventDate) => {
  const date = new Date(eventDate);
  date.setFullYear(currentYear);
  return date;
};
const sampleData = mockAppointments.map((dataItem) => ({
  id: dataItem.TaskID,
  start: parseAdjust(dataItem.Start),
  startTimezone: dataItem.StartTimezone,
  end: parseAdjust(dataItem.End),
  endTimezone: dataItem.EndTimezone,
  isAllDay: dataItem.isAllDay,
  title: dataItem.Title,
  description: dataItem.Description,
  recurrenceRule: dataItem.RecurrenceRule,
  recurrenceId: dataItem.RecurrenceID,
  recurrenceExceptions: dataItem.RecurrenceException,
  roomId: dataItem.RoomID,
  ownerID: dataItem.OwnerID,
  personId: dataItem.OwnerID,
}));
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const sampleDataWithResources = mockAppointments.map((dataItem) => ({
  id: dataItem.TaskID,
  start: parseAdjust(dataItem.Start),
  startTimezone: dataItem.StartTimezone,
  end: parseAdjust(dataItem.End),
  endTimezone: dataItem.EndTimezone,
  isAllDay: dataItem.isAllDay,
  title: dataItem.Title,
  description: dataItem.Description,
  recurrenceRule: dataItem.RecurrenceRule,
  recurrenceId: dataItem.RecurrenceID,
  recurrenceExceptions: dataItem.RecurrenceException,
  roomId: randomInt(1, 2),
  personId: randomInt(1, 2),
}));
const displayDate = new Date(Date.UTC(currentYear, 5, 24));
const customItem = (props) => (
  <SchedulerItem
    {...props}
    style={{
      ...props.style,
      backgroundColor: props.isAllDay ? "green" : "blue",
    }}
  />
);

const Calendar = () => {
  // const [data, setData] = React.useState(sampleData);
  const [data, setData] = React.useState(sampleDataWithResources);
  const [orientation, setOrientation] = React.useState("horizontal");
  const handleOrientationChange = React.useCallback(
    (event) => {
      setOrientation(event.target.value);
    },
    [setOrientation]
  );
  const handleDataChange = ({ created, updated, deleted }) => {
    setData((old) =>
      old
        // Filter the deleted items
        .filter(
          (item) =>
            deleted.find((current) => current.id === item.id) === undefined
        )
        // Find and replace the updated items
        .map(
          (item) => updated.find((current) => current.id === item.id) || item
        )
        // Add the newly created items and assign an `id`.
        .concat(
          created.map((item) =>
            Object.assign({}, item, {
              id: guid(),
            })
          )
        )
    );
  };
  return (
    <Box m={2}>
      <Box m={2}>
        <Header
          title="Kalendar"
          subtitle="Lassen Sie sich über anstehende Treffen benachrichtigen / Sehen Sie hier Ihre geplanten Termine ein."
        />
      </Box>
      <div>
      <div style={{ margin: "0 0 20px", padding: "20px", backgroundColor: "rgba(0,0,0,.03)", border: "1px solid rgba(0,0,0,.08)" }}>
        <label>
          Horizontal &nbsp;
          <input
            type="radio"
            value="horizontal"
            checked={orientation === "horizontal"}
            onChange={handleOrientationChange}
          />
        </label>
        &nbsp;
        <label>
          Vertical &nbsp;
          <input
            type="radio"
            value="vertical"
            checked={orientation === "vertical"}
            onChange={handleOrientationChange}
          />
        </label>
      </div>
      </div>

      <Scheduler
        data={data}
        defaultDate={displayDate}
        group={{
          resources: ["Rooms", "Persons"],
          orientation,
        }}
        resources={[
          {
            name: "Rooms",
            data: [
              {
                text: "Meeting Room 101",
                value: 1,
              },
              {
                text: "Meeting Room 201",
                value: 2,
                color: "green",
              },
            ],
            field: "roomId",
            valueField: "value",
            textField: "text",
            colorField: "color",
          },
          {
            name: "Persons",
            data: [
              {
                text: "Peter",
                value: 1,
                color: "red",
              },
              {
                text: "Alex",
                value: 2,
              },
            ],
            field: "personId",
            valueField: "value",
            textField: "text",
            colorField: "color",
          },
        ]}
        item={customItem}
        editable={{
          add: true,
          remove: true,
          drag: true,
          resize: true,
          edit: true,
        }}
        onDataChange={handleDataChange}
      >
  
        <DayView
          numberOfDays={3}
          slotDuration={30}
          slotDivisions={2}
          startTime={"06:00"}
          endTime={"20:00"}
          currentTimeMarker={true}
        />
        <WorkWeekView
          title="Arbeitswoche"
          workWeekStart={Day.Monday}
          workWeekEnd={Day.Friday}
        />
        <WeekView
          title="Wochen"
          workWeekStart={Day.Sunday}
          workWeekEnd={Day.Saturday}
        />
        <MonthView
          title="Monat"
          selectedShortDateFormat="{0:Y}"
          selectedDateFormat="{0:M}"
        />
        <TimelineView
          title="Stunden"
          numberOfDays={2}
          columnWidth={100}
          slotDuration={60}
          slotDivisions={1}
          startTime={"08:00"}
          endTime={"18:00"}
          workDayStart={"09:00"}
          workDayEnd={"17:00"}
          workWeekStart={Day.Sunday}
          workWeekEnd={Day.Monday}
          showWorkHours={false}
        />
        <AgendaView />
      </Scheduler>
    </Box>
  );
};

export default Calendar;
