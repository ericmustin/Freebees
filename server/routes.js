//require server-side itemController functions to interact with db
var ItemFuncs = require('./items/itemController.js');

module.exports = function(app){
  //when navigate to /api/items, retrieve all data rows from db
  app.get('/api/items', ItemFuncs.getAllItems);

  //when submit an item to be given away, save it to db
  app.post('/submit', ItemFuncs.saveItem);
  app.post('/pickup',ItemFuncs.removeItem);
  app.post('/api/uber',ItemFuncs.uberInfo);

  //any other route will load root
  app.get('*', function(req, res){
    res.redirect('/');
  });
};
