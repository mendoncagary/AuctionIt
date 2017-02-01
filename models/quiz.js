var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var quizSchema = new Schema({
  q_id:{
      type: Number,
      unique: true
  },
  q_question:{
      type: String,
      unique: true
  },
  q_op1:{
      type:String
  },
  q_op2:{
    type: String
  },
  q_op3:{
    type: String
  },
  q_op4:{
    type: String
  },
  q_ans:{
    type: String
  },
  q_starttime:{
    type: Date
  },
  q_endtime:{
    type: Date
  }

});

var Quiz  = mongoose.model('quiz',quizSchema,'quiz');

module.exports=Quiz;
