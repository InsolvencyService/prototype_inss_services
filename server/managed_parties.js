Meteor.methods({
  totalPartyCount:function(){
     return ManagedParties.find().count();
  }
});
try {
  ManagedParties._ensureIndex({
    "Name": "text"
  });
} catch (e) {

} finally {

}
Picker.route('/v1/managed_parties/', function(params, req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  if (params.query.q) {
    var parties = ManagedParties.find({
      "Name": {
        $regex: params.query.q,
        $options: 'i'
      }
    }, {
      fields: {
        '_id': 0 // Don't need the mongo id
      }
    }).fetch();

    res.statusCode = 200;
    res.end(JSON.stringify(parties));
  } else if (params.query.id){
	var results = ManagedParties.find(
	{
		"SourceRef": params.query.id
	}, {
      fields: {
        '_id': 0 // Don't need the mongo id
      }
    }).fetch();
	
	if (results.length === 1)
	{
	   res.statusCode = 200;
       res.end(JSON.stringify(results[0]));
	}
	else
	{
		res.statusCode = (results.length === 0 ? 404 : 400);
		res.end();
	}
  } else{
    res.statusCode = 400;
    res.end();
  }
});