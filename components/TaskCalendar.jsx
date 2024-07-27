"use client";
import React, { useState, useRef } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const TaskCalendar = ({ tasks }) => {
  const [tooltipContent, setTooltipContent] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [currentDate, setCurrentDate] = useState(new Date());
  const calendarRef = useRef(null);

  const tasksToEvents = (tasks) => {
    return tasks.map((task) => ({
      id: task._id,
      title: task.title,
      start: new Date(task.dueDate),
      end: new Date(task.dueDate),
      allDay: true,
      resource: {
        ...task,
        stage: task.stage,
        priority: task.priority,
        assignee: task.assignee.firstName,
      },
    }));
  };

  const handleMouseEnter = (event, e) => {
    const rect = e.target.getBoundingClientRect();
    const calendarRect = calendarRef.current.getBoundingClientRect();

    let top = rect.bottom + window.scrollY - calendarRect.top;
    let left = rect.left + window.scrollX - calendarRect.left;

    if (top + 200 > calendarRect.height) {
      top = rect.top - calendarRect.top - 200;
    }

    if (left + 300 > calendarRect.width) {
      left = calendarRect.width - 300;
    }

    setTooltipPosition({ top, left });
    setTooltipContent(
      <div>
        <strong>{event.title}</strong>
        <p>Stage: {event.resource.stage}</p>
        <p>Priority: {event.resource.priority}</p>
        <p>Assignee: {event.resource.assignee}</p>
        <p>Due: {new Date(event.start).toLocaleDateString()}</p>
      </div>,
    );
  };

  const handleMouseLeave = () => {
    setTooltipContent(null);
  };

  const CustomEvent = ({ event }) => {
    const stageColors = {
      Backlog: "bg-gray-300",
      Doing: "bg-blue-200",
      Review: "bg-purple-200",
      Done: "bg-green-200",
    };

    const priorityColors = {
      High: "border-red-500",
      Medium: "border-yellow-500",
      Low: "border-green-500",
    };

    return (
      <div
        onMouseEnter={(e) => handleMouseEnter(event, e)}
        onMouseLeave={handleMouseLeave}
        className={`${stageColors[event.resource.stage] || "bg-gray-100"} ${
          priorityColors[event.resource.priority] || "border-gray-500"
        } mb-1 cursor-pointer overflow-hidden border-l-4 p-1 text-xs leading-tight`}
      >
        <div className="truncate font-bold text-black">{event.title}</div>
        <div className="truncate text-black">
          {event.resource.assignee} - {event.resource.priority}
        </div>
      </div>
    );
  };

  const eventStyleGetter = () => {
    return {
      style: {
        backgroundColor: "transparent",
        border: "none",
      },
    };
  };

  return (
    <div ref={calendarRef} className="relative h-[800px] w-full">
      <Calendar
        localizer={localizer}
        events={tasksToEvents(tasks)}
        showAllEvents={true}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%", width: "100%" }}
        components={{
          event: CustomEvent,
        }}
        eventPropGetter={eventStyleGetter}
        date={currentDate}
        onNavigate={(date) => setCurrentDate(date)}
        views={["month"]}
        defaultView="month"
      />
      {tooltipContent && (
        <div
          className="absolute z-50 rounded border border-gray-300 bg-white p-2 shadow-md"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
          }}
        >
          {tooltipContent}
        </div>
      )}
    </div>
  );
};

export default TaskCalendar;
