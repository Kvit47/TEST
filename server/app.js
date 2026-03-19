const express = require("express");
const morgan = require("morgan");
const cors = require('cors')
const router = require("./routes")
const db = require("./config/db")
const { initializeSuperAdmin } = require("./controllers/auth.controller");
const passport = require("./config/passport");
const session = require("cookie-session");

const app = express();

const PORT = 5555;

db()
initializeSuperAdmin();

app.use(morgan("tiny")); // get, post, put, patch, delete

// ==== короткая версия ==== // conver JSON to JS object in POST, PUT, PATCH methods
app.use(express.json()) 

// ==== короткая версия ==== // conver Form Data to JS object in POST, PUT, PATCH methods
app.use(express.urlencoded({extended: true})) 

app.use(cors())

app.use(session({
  name: "session",
  keys: ["123"],
  maxAge: 24 * 60 * 60 * 1000,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(router)

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
