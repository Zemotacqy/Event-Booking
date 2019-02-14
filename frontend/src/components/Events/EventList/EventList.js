import React from 'react';

import './EventList.css';
import EventItem from './EventItem.js';

const eventList = props => {
    const events = props.events.map(event => {
        return (
            <EventItem 
                key={event._id} 
                eventId={event._id} 
                title={event.title} 
                price={event.price}
                date={event.date}
                userId={props.authuserId}
                creatorId={event.creator._id}
                onDetail={props.onViewDetail} />
        );
    });
    return(
    <ul className="events_list">{events}</ul>
)};

export default eventList;