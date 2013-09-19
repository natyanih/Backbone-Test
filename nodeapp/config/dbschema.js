var mongoose = require('mongoose');
var	bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

exports.mongoose = mongoose;

// Database connect
mongoose.connect('localhost', 'LearningCenter');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback() {
 	 console.log('Connected to DB');
});

//******* Database schema TODO add more validation
var Schema = mongoose.Schema
var ObjectId = Schema.ObjectId;

// User schema
var userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  usertype: { type: String, required: true},
  firstname: { type: String, required: true},
  lastname: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  admin: { type: Boolean, required: true},
  accessToken: { type: String } // Used for Remember Me
}, {collection: 'users'});


// Bcrypt middleware
userSchema.pre('save', function(next) {
	var user = this;

	if(!user.isModified('password')) return next();

	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if(err) return next(err);

		bcrypt.hash(user.password, salt, function(err, hash) {
			if(err) return next(err);
			user.password = hash;
			next();
		});
	});
});

// Password verification
userSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if(err) return cb(err);
		cb(null, isMatch);
	});
};

// Export user model
var userModel = mongoose.model('user', userSchema);
exports.userModel = userModel;
