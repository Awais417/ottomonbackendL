require("dotenv").config();
 var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var connectToDB = require("./db/conn.js");
const cors=require('cors')
var indexRouter = require("./routes/index");
 var authRouter = require("./routes/auth.js");
 var registerRouter = require("./routes/Register.js");
var usersRouter = require("./routes/users.js");
   const serviceRoute=require('./routes/service.js');
const serviceFormRoute=require('./routes/serviceForm.js');
var resetpasswordRouter = require("./routes/reset-password.js");
var userRouter = require("./routes/user.js");
const lawRouter = require("./routes/law.js");

const fileUpload=require('express-fileupload')
var app = express();
app.use(cors());
app.use(fileUpload({
  useTempFiles:true
}))
app.use(
  express.urlencoded({ extended: true })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
  });
app.use("/", indexRouter);
 app.use("/register", registerRouter);
 app.use("/auth", authRouter);
app.use("/users", usersRouter);
  app.use('/service',serviceRoute)
 app.use('/serviceForm',serviceFormRoute)
 app.use("/api/law", lawRouter);

app.use("/api/user", userRouter);
app.use("/reset-password", resetpasswordRouter);
//Initialize DB
connectToDB();

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, X-Requested-With, Content-Type, Accept"
  );
  next(createError(404));
});
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});
app.get('/signup', function(req, res){
  res.render('signin');
});
const port = process.env.PORT || 9001;
app.listen(port, () => console.log(`Listening to port ${port}`));
module.exports = app;



