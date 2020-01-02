import React from "react";

import { Bar as BarChart } from 'react-chartjs';

const BOOKINGS_BUCKETS = {
    "cheap" : {
        min: 0,
        max: 10
    },
    "Normal": {
        min: 10,
        max: 40
    },
    "Expensive" : {
        min: 40,
        max: 100000
    }
}

const BookingsChart = (props) => {
    let chartData = {labels: [], datasets: []};
    let values = [];
    for(const bucket in BOOKINGS_BUCKETS) {
        const filteredBookings = props.bookings.reduce((prev, curr) => {
            if(curr.event.price <= BOOKINGS_BUCKETS[bucket].max && curr.event.price > BOOKINGS_BUCKETS[bucket].min) {
                return prev+1;  
            } else {
                return prev;
            }
            
        }, 0);
        values.push(filteredBookings);
        chartData.labels.push(bucket);
        chartData.datasets.push({
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: values
        });
        
        values = [...values];
        values[values.length-1] = 0;
       
    }
    
    return (
        <div style={{textAlign: "center"}}><BarChart data={chartData}/></div>
    );
}

export default BookingsChart;