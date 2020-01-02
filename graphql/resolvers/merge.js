const Users = require('../../models/user.js');
const Events = require('../../models/Events.js');
const { dateToString } = require('./../helpers/date.js');
const DataLoader = require('dataloader');
// Dataloader expectsb a promise

const eventLoader = new DataLoader((eventIds) => {
    return events(eventIds);
});

const userLoader = new DataLoader((userIds) => {
    console.log(userIds);
    return Users.find({_id: {$in: userIds}});
});

const user = userId => {
    return userLoader.load(userId.toString())
        .then(result => {
            console.log("result: " + result._doc.createdEvents);
            const createdEventArray = new Array(result._doc.createdEvents);
            console.log("createdEvents: " + typeof(result._doc.createdEvents));
            return {
                ...result._doc, 
                _id: result.id,
                createdEvents: () => eventLoader.loadMany(result._doc.createdEvents)
            };
        })
        .catch(err => {
            throw err;
        });
}

const events = async eventIds => {
    try{
        const events = await Events.find({_id:eventIds});
        events.sort((a,b) => {
            return (eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString()));
        });
        return events.map(event => {
            return transformEvent(event);
        })
    } catch (err) {
        throw err;
    }
    
}

const singleEvent = async eventId => {
    /**
     * Here we need to use in ids; ID.toString()
     * This is because when it goes to dataloader for batching, its compared
     * the ids are compared if without toString(), it will be treated as  
     * objects and when compared it gives false
     * because two objects with same values are not same in js
     * So we convert them to string to convert and then be compared 
     */
    try {
        const event = await eventLoader.load(eventId.toString());
        return event;
    } catch(err) {
        throw err;
    }
}

const transformEvent = event => {
    console.log("Hola: ");
    console.log(event);
    return { 
        ...event._doc,
        _id: event.id, 
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    }
}

const transformBooking = booking => {
    return {
        ...booking._doc,
        _id: booking.id,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    };
}

exports.user = user;
exports.singleEvent = singleEvent;
exports.events = events;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;