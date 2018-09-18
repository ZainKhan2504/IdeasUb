const express  = require("express");
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
const passport = require("passport");
const router   = express.Router();

// Load Idea Model
require("../models/User");
const User = mongoose.model("users");

// User Register Route
router.get("/register", (req, res) => {
    res.render("users/register");
});

// Register Form Process
router.post("/register", (req, res) => {
    let errors = [];

    if (req.body.password != req.body.cpassword) {
        errors.push({text: "Password don't match"});
    }
    if(req.body.password.length < 4){
        errors.push({ text: "Password must be atleast 4 characters" });
    }
    if (errors.length > 0) {
        res.render("users/register", {
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            cpassword: req.body.cpassword
        })
    } else{
        User.findOne({email: req.body.email})
            .then(user => {
                if(user){
                    req.flash("error_msg", "Email already Registered");
                    res.redirect("users/register");
                } else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    });
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save()
                                .then(user => {
                                    req.flash("success_msg", "Your are now registered and can login");
                                    res.redirect("/users/login");
                                })
                                .catch(err => {
                                    console.log(err);
                                    return;
                                });
                        });
                    });
                }
            });
    }
});

// User Login Route
router.get("/login", (req, res) => {
    res.render("users/login");
});

// Login Form Process
router.post("/login", (req, res, next) => {
    passport.authenticate("local",{
        successRedirect: "/ideas",
        failureRedirect: "users/login",
        failureFlash: true
    })(req, res, next);
});

// Logout User
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "You are logged out");
    res.redirect("/users/login");
});

module.exports = router;