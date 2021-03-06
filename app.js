var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var serveIndex = require('serve-index');
var index = require('./routes/index');
var users = require('./routes/users');
var arfs = require('./routes/arfs');
var arf = require('./routes/arf');
var parser = require('./parser.js');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/'});
var fs = require('fs');
var app = express();
const decompress = require('decompress');
parser.parse();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/output', serveIndex(__dirname+'/public/output'));

app.use('/', index);
app.use('/users', users);
app.use('/arfs', arfs);
app.use('/arfs/:dir', arf);
app.post("/arfs_file", upload.single('arfs_file'), function(req, res, next){
  decompress(path.join(__dirname, `uploads/${req.file.filename}`), path.join(__dirname, 'arfs')).then(files => {
    res.sendStatus(200).send("OK");
  });
  
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
