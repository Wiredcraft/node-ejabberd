
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('host', 'ejabberd.local');
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.post('/create', routes.create);
app.post('/update', routes.update);
app.post('/remove/:host', routes.remove)
app.get('/admin/:host', routes.admin);
app.post('/add/:host', routes.add);
app.post('/register/:host', routes.register);
app.post('/remove/:host', routes.remove);
app.post('/unregister/:host', routes.unregister);
app.post('/change/:host', routes.change);
app.post('/modify', routes.modify);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
