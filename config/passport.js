const localStrategy = require("passport-local").Strategy;
const mongoose      = require("mongoose");
const bycrypt       = require("bcryptjs");

// Load Idea Model
const User = mongoose.model("users");

module.exports = function (passport) {
    passport.use(new localStrategy({usernameField: "email"}, (email, password, done) => {
        // Matching User
        User.findOne({
            email: email
        }).then(user => {
            if(!user){
                return done(null, false, {message: "No User Found"});
            }
            // Matching Password
            bycrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if (isMatch) {
                    return done(null, user)
                } else{
                    return done(null, false, { message: "Password Incorrect" });
                }
            })
        })
    }));
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}