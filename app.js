var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var https = require('https')
var fs = require('fs')
var axios = require('axios')

var app = express()
// 添加异常处理
const Layer = require('express/lib/router/layer');

Object.defineProperty(Layer.prototype, 'handle', {
  enumerable: true,
  get() {
    return this.__handle;
  },
  set(fn) {
    if (fn.length === 4) {
      this.__handle = fn;
    } else {
      this.__handle = (req, res, next) =>
        Promise.resolve()
          .then(() => fn(req, res, next))
          .catch(next);
    }
  },
})
app.get('/test', (request,response)=> {
  axios.get('http://localhost:3000/test').then(res => {
    response.send(res.data)
  }).catch(error => {
    response.status(error.response.status).send(error)
  })
})
// graphql 接口调用
const { createApolloFetch } = require('apollo-fetch');
app.get('/graphql',(request,response) => {
  const fetch = createApolloFetch({
    uri: 'http://localhost:8080/graphql',
  });
  
  fetch({
    query: '{ hello}',
  }).then(res => {
    console.log(res)
  })
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
var history = require('connect-history-api-fallback');
app.use(express.static(path.join(__dirname, './hello-world/dist')));
app.use(history());

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

// module.exports = app;
var options = {
  key: fs.readFileSync('./ssl/privatekey.pem'),
  cert: fs.readFileSync('./ssl/certificate.pem')
};

https.createServer(options, app).listen(3011, function () {
  console.log('Https server listening on port ' + 3011);
});

