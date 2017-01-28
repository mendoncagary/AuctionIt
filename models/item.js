var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bidSchema = new Schema({
  value: {
    type: Number
  },
  user_id: {
    type: String
  },
  first_name: {
    type: String
  }
});


var itemSchema = new Schema({
  i_name:{
      type: String,
      unique: true
  },
  i_desc:{
      type: String,
  },
  i_imgpath:{
      type:String
  },
  i_baseprice:{
    type: Number
  },
  i_increment:{
    type: Number
  },
  i_starttime:{
    type: Date
  },
  i_endtime:{
    type: Date
  },
  i_bidvalue:{
    type: Number,
    default: "0"
  },
  i_currentprice:{
    type: Number
  },
  bid: [bidSchema],
  i_is_won:{
    type: Boolean
  },
  i_flag:{
    type:Number
  },
  i_owner:{
    type:String
  }

});

var Item  = mongoose.model('item',itemSchema);

module.exports=Item;
