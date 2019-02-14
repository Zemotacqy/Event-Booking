import React from "react";

import './BookingsControls.css';

const BookingsControl = (props) => {
    return (
        <div className="bookings-control">
            <button className={props.activeOutputType === "List" ? "active" : ""} onClick={props.onChange.bind(this, "List")}>List</button>
            <button className={props.activeOutputType === "Chart" ? "active" : ""} onClick={props.onChange.bind(this, "Chart")}>Chart</button>
        </div>
    );
}

export default BookingsControl;