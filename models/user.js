var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var badgeSchema = new Schema({
    beginner:{
      value: Boolean,
      imgpath: String
  },
  intermediate:{
    value: Boolean,
    imgpath: String
  },
  advanced:{
    value: Boolean,
    imgpath: String
  }
});


var userSchema = new Schema({
  tek_userid:{
    type: String,
    unique: true
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
  },
  quiz_no_attempts:{
    type: Number
  },
  wof_no_attempts:{
    type: Number
  },
  badge: [badgeSchema]
});

var User=mongoose.model('user',userSchema);

module.exports=User;
