var app = angular.module('configurationApp', []);

app.controller('configController', function ($scope) {
	//$scope.tableData = {}; 
	var dbValues = [];
	var awsConfig = {

		"region" : region,
		// "endpoint" :endpoint,
		"accessKeyId" : accessKeyId,
		"secretAccessKey" : secretAccessKey	
	};
	AWS.config.update(awsConfig);
	var docClient = new AWS.DynamoDB.DocumentClient();
	var params = {
		TableName: "ParamaterizedData"
		//TableName : "DummyTable"
	};
	docClient.scan(params, function (err, data) {
		if (err) {
			console.log("error");
		}
		else {
			console.log("success");
			for (var dbValue = 0; dbValue < data.Items.length; dbValue++) {
				//alert(data.Items[dbValue].RatedPower);
				$scope.rpower = data.Items[dbValue].RatedPower;
				$scope.rateeff = data.Items[dbValue].RatedEfficiency;
				$scope.minflow = data.Items[dbValue].MinimumFlow;
				$scope.threshold = data.Items[dbValue].ThresholdLimits;
				$scope.rflow = data.Items[dbValue].RatedFlow;
				$scope.rspeed = data.Items[dbValue].RatedSpeed;
			}
			$scope.$apply();

		}

	});


	
	$scope.updateConfigData = function(){
		 
		$scope.tableData = {
		   rpower : $scope.rpower,
		   rateeff : $scope.rateeff,
		   minflow : $scope.minflow,
		   threshold : $scope.threshold,
		   rflow : $scope.rflow,
		   rspeed : $scope.rspeed
		   };
	   
		   console.log('table data', $scope.rspeed);
		   
	   var params1 = {
	   TableName: "ParamaterizedData",
	   Key: {
		   
		   "Id": "10"
	   },
	   UpdateExpression: "set RatedPower = :ratedPower, RatedSpeed = :ratedSpeed ,RatedFlow = :ratedFlow,MinimumFlow = :minFlow,RatedEfficiency = :ratedEff,ThresholdLimits = :threshold",
	   ExpressionAttributeValues: {
		   ":ratedPower":  $scope.rpower,
		   ":ratedSpeed":  $scope.rspeed ,
		   ":ratedFlow":  $scope.rflow,
		   ":threshold":  $scope.threshold,
		   ":minFlow":  $scope.minflow,
		   ":ratedEff":  $scope.rateeff
	   },
	   ReturnValues: "UPDATED_NEW"
   };
   /*var ddb = new AWS.DynamoDB() ;
	   ddb.updateItem(params, function(err, data) {
		   if (err) { return console.log(err); }
		   console.log("We updated the table with this: " + JSON.stringify(data));
   });*/
	   console.log("Updating the item...");
   docClient.update(params1, function (err, data) {
	   if (err) {
		   console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
		   swal({
			title: "<i>Error!</i>", 
			html: "Something Goes Wrong",  
			confirmButtonText: "<u>OK</u>", 
		  });
	   } else {
		   
		   console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
		   swal({
			title: "<i>Success!</i>", 
			html: "Data Saved Successfully",  
			confirmButtonText: "<u>OK</u>", 
		  });
		   //swal("Saved!", "Data Saved Successfully", "success");
	   }
   });

}
});
