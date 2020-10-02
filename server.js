const dotenv = require('dotenv');
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const users = require("./routes/api/users");
const pumps = require("./routes/api/pumps")
const files = require("./routes/api/files")
const passport = require("passport");
const bodyParser = require("body-parser");
const cors = require('cors')
const app = express();
// Enabling Cors
app.use(cors())

//Adding middlerware to express app
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

//Config Keys
const db = require("./config/keys").mongoURI;

//Connect to MongoDB using Mongoose
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err, "Error"));

//Adding passport middleware
app.use(passport.initialize());

// Routes APIs
app.use("/api/users", users);
app.use("/api/pumps", pumps);
app.use("/api/files", files);

//Passport Config
require("./config/passport")(passport);

// Setting up static content directory
app.use('/uploads', express.static(__dirname + '/public'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Running server on Port ${PORT}`));
