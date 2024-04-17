var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var authRoute = require('./routes/auth');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var mongoose = require('mongoose');
var database = "mongodb+srv://ngophucquan2002:8Ki8WNdynOTFcEpU@cluster0.q042eiq.mongodb.net/asm2db";
mongoose.connect(database)
.then(()=> console.log("Connect to DB success"))
.catch((error)=> console.error("Connect to DB failed" + err));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//ROUTES
app.use("/v1/auth", authRoute);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
var port = process.env.PORT || 3001; // Nếu không có cổng được đặt, sẽ sử dụng cổng 3000
app.listen(port, () => {
  console.log(`Web is running on Port ${port}`);
});

module.exports = app;
