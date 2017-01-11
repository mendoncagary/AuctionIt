var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var adminSchema = new Schema({
  username:{
      type: String,
      unique: true
  },
  password:{
      type: String
  },
  master_admin_control:{
    type: String
  }
});

var Admin = mongoose.model('admin',adminSchema,'admin_user');

module.exports=Admin;
