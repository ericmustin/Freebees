var mongoose = require('mongoose');

//create a new mongoDB table called ItemSchema
var ItemSchema = new mongoose.Schema ({

  //ItemSchema table has a column for itemName, which is a string
  itemName :{
    type: String,
    required: false
  },

  worker : {
    type: String,
    required: false
  },

  //ItemSchema table has a column for createdAt and itemLocation, which is an object with lat and lng props
  itemLocation :{
    type: Object,
    required: true
  },
  //need speicifc itemLng and itemLat for the delete functionality, for some reason we can't match the properties in the itemLocation obj
   itemLng: {
    type: Number,
    required: true
  },

  itemLat: {
    type: Number,
    required: true
  },

  createdAt: {
    type: Date,
    required: true
  },

  eventTime: {
    type: Object,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  itemImageUrl: {
    type: String,
    require: false
  }
});

//export the Item mongoose model that will fit into the ItemSchema table
module.exports = mongoose.model('Item', ItemSchema);
