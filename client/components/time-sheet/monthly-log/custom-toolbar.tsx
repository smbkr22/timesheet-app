import React from "react";

type CustomToolbarProps = {
  label: string;
  onClickAllEvents: () => void;
  onClickPastEvents: () => void;
  onClickUpcomingEvents: () => void;
};

const navigate = {
  PREVIOUS: "PREV",
  NEXT: "NEXT",
  TODAY: "TODAY",
  DATE: "DATE",
};

const CustomToolbar = (props: CustomToolbarProps) => {
  const { label, onClickAllEvents, onClickPastEvents, onClickUpcomingEvents } =
    props;
  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button
          type="button"
          className="btn btn-control"
          onClick={this.navigate.bind(null, navigate.PREVIOUS)}
        >
          <i className="fa fa-arrow-left"></i> Prev
        </button>
      </span>
      <span className="rbc-btn-group">
        <button
          type="button"
          className="btn btn-control"
          onClick={this.navigate.bind(null, navigate.NEXT)}
        >
          Next <i className="fa fa-arrow-right"></i>
        </button>
      </span>
      <span className="rbc-toolbar-label">{label}</span>
      <span className="rbc-btn-group">
        <button
          type="button"
          className="btn btn-control"
          onClick={(e) => onClickAllEvents()}
        >
          All
        </button>
      </span>
      <span className="rbc-btn-group">
        <button
          type="button"
          className="btn btn-past"
          onClick={(e) => onClickPastEvents()}
        >
          Past
        </button>
      </span>
      <span className="rbc-btn-group">
        <button
          type="button"
          className="btn btn-upcoming"
          onClick={(e) => onClickUpcomingEvents()}
        >
          Upcoming
        </button>
      </span>
    </div>
  );
};

export default CustomToolbar;
