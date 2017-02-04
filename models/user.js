var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  tek_userid:{
    type: String,
    unique: true
  },
  tek_name:{
      type: String,
  },
  u_firstvisit:{
    type: Boolean
  },
  u_cashbalance:{
    type: Number
  },
  u_cashspent:{
    type: Number
  },
  meg_points:{
    type: Number
  },
  u_itemswon:{
    type: Number
  },
  u_itemssold:{
    type: Number
  },
  u_itempoints:{
    type: Number
  },
  u_quizlevel:{
    type: Number
  },
  chat_status:{
    type: Boolean
  },
  quiz_attempt_status:{
    type: Boolean
  },
  wof_status:{
    type: Boolean
  },
  wof_flag:{
    type: Boolean
  },
  quiz_flag:{
    type: Boolean
  },
  rating:{
    type: Number
  }
});

var User=mongoose.model('user',userSchema);

module.exports=User;
