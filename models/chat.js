var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chatSchema = new Schema({
  message: {
    type: String,
  },
  from_user: {
    type: String,
  },
  time:{
    type: Date
  }
});

var Chat  = mongoose.model('chat',chatSchema);

module.exports=Chat;
