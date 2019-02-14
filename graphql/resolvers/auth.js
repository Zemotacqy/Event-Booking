const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const Users = require('../../models/user.js');

const { dateToString } = require("./../helpers/date.js");


module.exports = {
    login: async args => {
        const user = await Users.findOne({ email: args.email });
        if(!user) {
            throw new Error("User Doesn't exists");
        }
        const isEqual = await bcrypt.compare(args.password, user.password);
        if(!isEqual) {
            throw new Error("Password incorrect");
        }
        const token = jwt.sign({userId: user.id, email: user.email}, process.env.JWT_KEY, {
            expiresIn: '3h'
        });
        return {userId: user.id, token: token, tokenExpiration: 3};
    },
    createUser: args => {
        return Users.findOne({email: args.userInput.email}).then(user => {
            if(user){
                throw new Error("User Exists Already!");
            } 
            return bcrypt.hash(args.userInput.password, 12)
        })
        .then(hash => {
            const User = new Users({
                _id: mongoose.Types.ObjectId(),
                email : args.userInput.email,
                password: hash
            });
            return User.save();
        })
        .then(result => {
            return {
                ...result._doc, 
                password: null, 
                _id: result.id
            };
        })
        .catch(err => {
            console.log(err);
            throw err;
        });
    }
};