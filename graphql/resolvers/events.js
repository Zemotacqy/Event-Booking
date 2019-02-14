const { dateToString } = require("./../helpers/date.js");
const Events = require('../../models/Events.js');
const { user, transformEvent } = require('./merge.js');
const Users = require('./../../models/user.js');
const mongoose = require('mongoose');


module.exports = {
    /**
     * We are not using eventLoader here 
     * because dataloader needs keys to map 
     * it with values or returned docs
     */
    events: () => {
        return Events.find()
        .then(events => {
            return events.map(event => {
                console.log(event);
                return transformEvent(event);
            });
        }).catch(err => {
            console.log(err);
            throw err;
        });
    },
    createEvent: (args, req) => {
        if(!req.isAuth){
            throw new Error("Unauthenticated");
        }
        let createdEvent;
        const event = new Events({
            _id: mongoose.Types.ObjectId(),
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: req.userId
        });
        return event.save().then(result => {
            createdEvent = transformEvent(result);
            console.log(req.userId);
            return Users.findById(req.userId);
        })
        .then(user => {
            if(!user){
                throw new Error("User Not found!");
            } 
            user.createdEvents.push(event);
            return user.save();
        })
        .then(result => {
            return createdEvent;
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
    }
};