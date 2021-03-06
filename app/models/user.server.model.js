var mongoose = require('mongoose'),
    crypto   = require('crypto'),
    Schema   = mongoose.Schema;

var UserSchema = new Schema({
  role: {
    type: String,
    enum: ['Admin', 'Moderator', 'User'],
    default: 'User'
  },
  firstName: {
    type: String,
    required: 'First Name is required',
    validate: [
      function(name) {
        return name.length >= 3 && name.length <= 50;
      },
      'First Name length is not valid',
    ]
  },
  lastName: {
    type: String,
    required: 'Last Name is required',
    validate: [
      function(name) {
        return name.length >= 3 && name.length <= 50;
      },
      'Last Name length is not valid',
    ]
  },
  email: {
    type: String,
    index: true,
    required: 'E-mail is required',
    validate: [
      function(email) {
        return email.length <= 50;
      },
      'Email is too long',
    ],
    match: [/.+\@.+\..+/, "Please fill a valid e-mail address"]
  },
  address: {
    type: String,
    required: 'Address is required',
    validate: [
      function(address) {
        return address.length >= 10 && address.length <= 100;
      },
      'Address length is not valid',
    ]
  },
  phone: {
    type: String,
    required: 'Phone is required',
    match: [/^\+*(\d{3})*[0-9,\-]{8,}/, 'Phone is not valid']
  },
  username: {
    type: String,
    trim: true,
    unique: true,
    required: 'Username is required',
    validate: [
      function(name) {
        return name.length >= 5 && name.length <= 50;
      },
      'Username length is not valid',
    ]
  },
  password:  {
    type: String,
    required: true,
    validate: [
      function(password) {
        return password.length >= 5 && password.length <= 50;
      },
      'Password length is not valid',
    ]
  },
  salt: {
    type: String
  },
  provider: {
    type: String,
    required: 'Provider is required'
  },
  providerId: String,
  providerData: {},
  created: {
    type: Date,
    default: Date.now
  }
});

UserSchema.virtual('fullName')
  .get(function() {
    return this.firstName + ' ' + this.lastName;
  })
  .set(function(fullName) {
    var splitName = fullName.split(' ');
    this.firstName = splitName[0] || '';
    this.lastName = splitName[1] || '';
  });

UserSchema.pre('save', function(next) {
  if (this.password) {
    this.salt = new
    Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    this.password = this.hashPassword(this.password);
  }
  next();
});

UserSchema.methods.hashPassword = function(password) {
  return crypto.pbkdf2Sync(password, this.salt, 10000, 64, 'sha1').toString('base64');
};

UserSchema.methods.authenticate = function(password) {
  return this.password === this.hashPassword(password);
};

UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
  var possibleUsername = username + (suffix || '');

  this.findOne({
    username: possibleUsername
  }, function(err, user) {
    if (!err) {
      if (!user) {
        callback(possibleUsername);
      } else {
        return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
      }
    } else {
      callback(null);
    }
  });
};

UserSchema.set('toJSON', {
  getters: true,
  virtuals: true
});

mongoose.model('User', UserSchema);
