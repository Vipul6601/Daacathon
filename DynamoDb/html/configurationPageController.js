var app = angular.module('configurationApp',[]);

 app.controller('configController', function($scope) {
    //$scope.tableData = {}; 
	var dbValues = [];
	var awsConfig = {
		"region" : "ap_south_1",
		"endpoint" : "http://localhost:8000",
		"accessKeyId" : "TestAccessKey",
		"secretAccessKey" : "TestSecretKey"	
	};
	AWS.config.update(awsConfig);
	var docClient = new AWS.DynamoDB.DocumentClient();
	var params = {
				TableName : "ParamaterizedData"
				//TableName : "DummyTable"
			};	
	docClient.scan(params,function(err, data){
	if(err)
	{
	  console.log("error");
	}
	else 
	{
	 console.log("success");
	 for(var record in data)
	 {
	  //alert(JSON.stringify(data[record], undefined, 2)); 							
		for(var item in data[record])
		{
		  for(var header in data[record][item])
			{	
				var value = data[record][item][header];
				console.log(value);
				dbValues.push(value);
			}
		}					
	  }
	  alert("ssssssssss"+dbValues);			

	$scope.SignalName=dbValues[0];
	$scope.rspeed=dbValues[1];
	
	$scope.rflow=dbValues[2];
	$scope.wdensity=dbValues[4];
	$scope.charpump=dbValues[5];
	$scope.threshold=dbValues[7];
	$scope.$apply();
	}		
	
	});
	
	
	$scope.updateConfigData = function(){
		 
		 $scope.tableData = {
			SignalName : $scope.SignalName,
			rspeed : $scope.rspeed,
			rflow : $scope.rflow,
			wdensity : $scope.wdensity,
			charpump : $scope.charpump,
			threshold : $scope.threshold
			};
		
			console.log('table data', $scope.SignalName);
			/*var params = {
				TableName : "ParamaterizedData",		
				//Item :$scope.submitConfigData
				Key : $scope.submitConfigData
			};		
	var ddb = new AWS.DynamoDB() ;
	 ddb.updateItem(params, function(err, data) {
        if (err) { return console.log(err); }
        console.log("We updated the table with this: " + JSON.stringify(data));
    });*/
 }
});
