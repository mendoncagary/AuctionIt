var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name:{
      type: String,
      unique: true
  },
  password:{
      type:String
  }
});

var User=mongoose.model('user',userSchema,'user_details');

module.exports=User;
