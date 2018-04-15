var app = angular.module('testDataApp', []);

app.controller('testController', function ($scope) {
	//$scope.tableData = {}; 
	var dbValues = [];
	var awsConfig = {

		"region": region,
		// "endpoint" :endpoint,
		"accessKeyId": accessKeyId,
		"secretAccessKey": secretAccessKey
	};
	AWS.config.update(awsConfig);
	var docClient = new AWS.DynamoDB.DocumentClient();
	var params = {
		TableName: "TestData"
		//TableName : "DummyTable"
	};
	docClient.scan(params, function (err, data) {
		if (err) {
			console.log("error");
		}
		else {
			console.log("success");
			for (var record in data) {
				//alert(JSON.stringify(data[record], undefined, 2)); 							
				for (var item in data[record]) {
					for (var header in data[record][item]) {
						var value = data[record][item][header];
						console.log(value);
						dbValues.push(value);
					}
				}
			}
			//  alert("ssssssssss"+dbValues);			

			$scope.SignalName = dbValues[0];
			$scope.rspeed = dbValues[1];

			$scope.rflow = dbValues[2];
			$scope.wdensity = dbValues[4];
			$scope.charpump = dbValues[5];
			$scope.threshold = dbValues[7];
			$scope.$apply();
		}

	});

	$scope.uploadData = function () {
		var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
		if (regex.test($("#fileUpload").val().toLowerCase())) {
			$scope.fileUploaded = true;
			if (typeof (FileReader) != "undefined") {
				var reader = new FileReader();
				reader.onload = function (e) {
					var table = $("<table class='responsive-table' id='testData'/>");
					//table.setAttribute('class', 'responsive-table');
					//table.addClass = "pure-table";
					var rows = e.target.result.split("\n");
					for (var i = 0; i < rows.length; i++) {

						var row = $("<tr />");
						var cells = rows[i].split(",");
						for (var j = 0; j < cells.length; j++) {
							var cell;
							if (i == 0) {
								cell = $("<th />");
							}
							else {
								cell = $("<td />");
							}
							if (i == 0) {
								cell.html(cells[j]);
							}
							else {
								var input = document.createElement("input");
								input.type = "text";
								input.name = "member" + i;
								input.value = cells[j];
								cell.append(input);
							}
							row.append(cell);
						}
						var rowHead;
						if (i == 0) {
							rowHead = $("<thead />");
						}
						else {
							rowHead = $("<tbody />");
						}
						rowHead.append(row);
						table.append(rowHead);
					}
					$("#dvCSV").html('');
					$("#dvCSV").append(table);
				}
				reader.readAsText($("#fileUpload")[0].files[0]);
			} else {
				alert("This browser does not support HTML5.");
			}
		} else {
			alert("Please upload a valid CSV file.");
		}
	}
	$scope.updateConfigData = function () {
		var TableData = new Array();
		var eff;
		var flow;
		var tdh;
		var counter = 0;
		$('#testData tbody tr').each(function (row, tr) {
			TableData[row] = {
				"FluidFlow": $(tr).find('td:eq(0) input:text').each(function () {
					flow = this.value;
				})
				, "TDH": $(tr).find('td:eq(1) input:text').each(function () {
					tdh = this.value;
				})
				, "Efficiency": $(tr).find('td:eq(2) input:text').each(function () {
					eff = this.value;
				})
			}
			counter = counter + 1;
			var countStr = counter + '';
			console.log('table data', $scope.SignalName);
			var params = {
				TableName: "TestData",
				Key: {

					"Id": countStr
				},
				UpdateExpression: "set Efficiency = :ratedPower, FluidFlow = :ratedSpeed ,TDH = :ratedFlow",
				ExpressionAttributeValues: {
					":ratedPower": eff,
					":ratedSpeed": flow,
					":ratedFlow": tdh
				},
				ReturnValues: "UPDATED_NEW"
			};
			/*var ddb = new AWS.DynamoDB() ;
				ddb.updateItem(params, function(err, data) {
					if (err) { return console.log(err); }
					console.log("We updated the table with this: " + JSON.stringify(data));
			});*/
			console.log("Updating the item...");
			docClient.update(params, function (err, data) {
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
		});
		TableData.shift();




	}
});
