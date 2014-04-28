var http           = require('http');
var path           = require('path');
var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');

var routes         = require('./routes');
var user           = require('./routes/user');
var task           = require('./routes/task');
var db             = require('./models');


var app            = express();

app.set('port', process.env.PORT || 3000)
app.set('views', __dirname + '/views')
app.set('view engine', 'jade')

app.use(express.static(__dirname + '/public'));   // set the static files location /public/img will be /img for users
app.use(morgan('dev'));           // log every request to the console
app.use(bodyParser());            // pull information from html in POST
app.use(methodOverride());          // simulate DELETE and PUT

//app.use(express.favicon())
//app.use(express.logger('dev'))
//app.use(express.json())
//app.use(express.urlencoded())
//app.use(express.methodOverride())
//app.use(app.router)

var env = process.env.NODE_ENV || 'development';
if ('development' == env) {
   // configure stuff here
}
 
app.get('/', routes.index)
app.post('/users/create', user.create)
app.post('/users/:user_id/tasks/create', task.create)
app.get('/users/:user_id/tasks/:task_id/destroy', task.destroy)
 
db
  .sequelize
  .sync({ force: true })
  .complete(function(err) {
    if (err) {
      throw err[0]
    } else {
      http.createServer(app).listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'))
      })
    }
  })