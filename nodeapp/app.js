var express = require('express');
var mongoose = require('mongoose');

var app = express();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

  
// configure Express
app.configure(function() {
  app.use(allowCrossDomain);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.logger('dev'));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});


// Database connect
mongoose.connect('localhost', 'contacts');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback() {
 	 console.log('Connected to DB');
});

//******* scheme for contacts manager
var Schema = mongoose.Schema
var ObjectId = Schema.ObjectId;

// Contacts schema
var contactsSchema = new Schema({
  name: { type: String, required: true},
  number: { type: String, required: true},
  username: { type: String, required: true, unique: true},
}, {collection: 'contacts'});


var contactModel = mongoose.model('contacts', contactsSchema);

app.get('/contacts', listContacts );
app.post('/contacts', addContact );
// app.put('/:id', updateContact );
// app.delete('/:id', deleteContact );

function listContacts(req, res){
	contactModel.find(function(err, data){
		if(err){
      console.log(err);
      res.send(500, err);
    }
		else{
			console.log(data);			
			res.send(data, 200);
		}
	});
}

function addContact(req, res){
  console.log(req.body);
  contactModel.create(req.body, function (err, doc) {
    if (err) {
      console.log(err);
      res.send(500, err);
    } else {
      res.send(200, doc);
    }
  });
}

app.listen(9090, function() {
  console.log('Express server listening on port 9090');
});

