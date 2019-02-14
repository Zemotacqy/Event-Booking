import React from 'react';
import { NavLink } from 'react-router-dom';

import AuthContext from './../../context/auth-context.js';
import './MainNavigation.css';

const mainNavigation = props => (
    <AuthContext.Consumer>
        {
            (context) => {
                return (
                <header className="main-navigation">
                    <div className="main-navigation_logo">
                        <h1>Event Booker</h1>
                    </div>
                    <nav className="main-navigation_items">
                        <ul>
                            <li><NavLink to="/events">Events</NavLink></li>
                            {context.token && (
                                <React.Fragment>
                                <li><NavLink to="/bookings">Bookings</NavLink></li>
                                <li><button onClick={context.logout}> Logout</button></li>
                                </React.Fragment>
                            ) }
                            {!context.token && (<li><NavLink to="/auth">Authenticate</NavLink></li>)}
                        </ul>
                    </nav>
                </header>
                )
            }
        }
   
    </AuthContext.Consumer>
);

export default mainNavigation;