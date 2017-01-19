var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
  }
});

var Item  = mongoose.model('item',itemSchema);

module.exports=Item;
