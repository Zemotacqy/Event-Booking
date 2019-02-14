const Bookings = require('./../../models/booking.js');
const { dateToString } = require("./../helpers/date.js");
const { user, singleEvent, transformBooking, transformEvent} = require('./merge.js');
const Events = require('./../../models/Events.js');

module.exports = {
    bookings: async (args, req) => {
        if(!req.isAuth){
            throw new Error("Unauthenticated");
        }
        try{
            const bookings = await Bookings.find({ user: req.userId });
            return bookings.map(booking => {
                return transformBooking(booking);
            })
        } catch(err) {
            throw err;
        }
    },
    bookEvent: async (args, req) => {
        if(!req.isAuth){
            throw new Error("Unauthenticated");
        }
        const fetchedEvent = await Events.findOne({_id: args.eventId}); 
        const Booking = new Bookings({
            event: fetchedEvent,
            user: req.userId
        });
        const result = await Booking.save();
        return transformBooking(result);
    },
    cancelBooking: async (args, req) => {
        if(!req.isAuth){
            throw new Error("Unauthenticated");
        }
        try {
            const booking = await Bookings.findById(args.bookingId).populate('event');
            const event = transformEvent(booking.event);
            console.log(event);
            await Bookings.deleteOne({_id: args.bookingId});
            return  event;
        } catch(err) {
            throw err;
        }
    }
};