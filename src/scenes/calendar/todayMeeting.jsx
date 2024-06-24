import React, { useState, useEffect } from "react";
import { mockAppointments } from "../../data/mockCalendar"; // Adjust path as per your project structure
import { Box } from "@mui/material";

const TodayMeeting = () => {
  const [meetingsToday, setMeetingsToday] = useState([]);
  useEffect(() => {
    const today = new Date().toLocaleDateString(); // Get today's date
    const filteredMeetings = mockAppointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.Start).toLocaleDateString();
      return appointmentDate === today;
    });
    setMeetingsToday(filteredMeetings);
  }, []);
  /* const getBackgroundColor = (start, end) => {
    const currentDate = new Date();
    const startTime = new Date(start);
    const endTime = new Date(end);

    // Check if the appointment is for the whole day
    if (startTime.getHours() === 0 && endTime.getHours() === 0) {
      return "green"; // Whole day
    } else if (currentDate >= startTime && currentDate <= endTime) {
      return "green"; // Current ongoing meeting
    } else {
      return "blue"; // Other meetings
    }
  }; */
  return (
    <Box>
      {meetingsToday.map((meeting) => (
        <Box
          key={meeting.TaskID}
          mt={2}
          p={2}
          style={{
            cursor: 'pointer',
            backgroundColor: meeting.isAllDay ? 'green' : 'blue',
            ...meeting.style,
          }}
        >
          {meeting.Title}
        </Box>
      ))}
    </Box>
  );
};

export default TodayMeeting;
