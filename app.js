const path           = require("path");
const express        = require("express");
const exphbs         = require("express-handlebars");
const bodyParser     = require("body-parser");
const methodOverride = require("method-override");
const session        = require("express-session");
const flash          = require("connect-flash");
const mongoose       = require("mongoose");
const passport       = require("passport");
const app            = express();

// Load Routes
const ideas = require("./routes/ideas");
const users = require("./routes/users");

// Passport Config
require("./config/passport")(passport);

// DB Config
const db = require("./config/database");

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;

// Connect to mongoose
mongoose
  .connect(
    db.mongoURI,
    {
      useNewUrlParser: true
    }
  )
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Handlebars Middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// Method Override Middleware
app.use(methodOverride("_method"));

// Static folder Middleware
app.use(express.static(path.join(__dirname, "public")));

// Express-Session Middleware
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash Middleware
app.use(flash());

// Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next();
})

// index route
app.get("/", (req, res) => {
    const title = "Welcome"
    res.render("index", {
        title: title
    });
});

// about route
app.get("/about", (req, res) => {
    res.render("about");
});

// Use Routes
app.use("/users", users);
app.use("/ideas", ideas);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});