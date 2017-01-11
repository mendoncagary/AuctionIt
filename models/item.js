var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
  i_name:{
      type: String,
      unique: true
  },
  i_imgpath:{
      type:String
  },
  i_starttime:{
    type: Date
  },
  i_endtime:{
    type: Date
  },
  i_baseprice:{
    type: String
  }
});

var Item  = mongoose.model('item',itemSchema);

module.exports=Item;
