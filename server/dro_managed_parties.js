Meteor.methods({
  totalDROPartyCount:function(){
     return DROManagedParties.find().count();
  }
});
try {
  DROManagedParties._ensureIndex({
    "Name": "text"
  });
} catch (e) {

} finally {

}
Picker.route('/v1/dro_managed_parties/', function(params, req, res, next) {
  res.setHeader('Content-Type', 'application/json');
  if (params.query.q) {
    var escapedQuery = params.query.q.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    //Match start of the party's name
    var regExpression = new RegExp('^' + escapedQuery);
    var parties = DROManagedParties.find({
      "Name": {
        $regex: regExpression,
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
	var results = DROManagedParties.find(
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
