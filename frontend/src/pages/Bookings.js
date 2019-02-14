import React, { Component } from 'react';
import AuthContext from './../context/auth-context.js';

import Spinner from './../components/Spinner/Spinner.js';
import BookingList from './../components/Bookings/BookingList/BookingList.js';
import BookingsChart from './../components/Bookings/BookingsChart/BookingsChart.js';
import BookingsControl from './../components/Bookings/BookingsControls/BookingsControls.js';
//import { readdirSync } from 'fs';

class BookingsPage extends Component {
    state= {
        isLoading: false,
        bookings: [],
        outputType : "List"
    }

    static contextType = AuthContext;

    componentDidMount() {
        this.fetchBookings();
    }

    fetchBookings = () => {
        this.setState({isLoading: true});
        const requestBody = {
            query: `
                query {
                    bookings {
                        _id
                        createdAt
                        event {
                            _id
                            title
                            date
                            price
                        }
                    }
                }
            `
        }
        console.log(JSON.stringify(requestBody));

        fetch('http://localhost:8000/graphql', {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": 'Bearer '  + this.context.token
            }
        }).then(res => {
            if(res.status !== 200 && res.status!== 201){
                throw new Error("Failed");
            }
            return res.json(); 
        }).then(resData => {
            const bookings = resData.data.bookings;
            this.setState({bookings: bookings, isLoading: false});
        }).catch(err => {
            console.log(err);
            this.setState({isLoading: false});
        });
    }
    deleteBookingHandler = bookingId => {
        this.setState({isLoading: true});
        const requestBody = {
            query: `
                mutation CancelBooking($id: ID!) {
                    cancelBooking(bookingId: $id) {
                        _id
                        title
                    }
                }
            `,
            variables: {
                id: bookingId
            }
        }

        fetch('http://localhost:8000/graphql', {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": 'Bearer '  + this.context.token
            }
        }).then(res => {
            if(res.status !== 200 && res.status!== 201){
                throw new Error("Failed");
            }
            return res.json(); 
        }).then(resData => {
            this.setState(prevState => {
                const updatedBooking = prevState.bookings.filter(booking => {
                    return (booking._id !== bookingId)
                });
                return {bookings: updatedBooking, isLoading: false};
            });
        }).catch(err => {
            console.log(err);
            this.setState({isLoading: false});
        });
    }

    changeOutputTypeHandler = outputType => {
        if(outputType === "List") {
            this.setState({outputType: "List"});
        } else {
            this.setState({outputType: "Chart"});
        }
    }

    render() {
        let content = <Spinner />
        if(!this.state.isLoading) {
            content = (
                <React.Fragment>
                    <BookingsControl 
                        onChange={this.changeOutputTypeHandler} 
                        activeOutputType={this.state.outputType}
                    />
                    <div>
                        {this.state.outputType === "List" ? (
                    <BookingList bookings={this.state.bookings} onDelete={this.deleteBookingHandler}
                    />) : (
                        <BookingsChart bookings={this.state.bookings} />
                    )} 
                    </div> 
                </React.Fragment>
            );
        }
        return (
            <React.Fragment>
                {content}
            </React.Fragment>
        );
    }
}


export default BookingsPage;