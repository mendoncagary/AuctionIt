var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tek_userSchema = new Schema({
  user_id:{
      type: String,
      unique: true
  },
  first_name:{
      type:String
  },
  last_name:{
      type:String
  },
  password:{
    type: String
  }
});

var Tek_user=mongoose.model('tek_user',tek_userSchema,'tek_user');

module.exports=Tek_user;
