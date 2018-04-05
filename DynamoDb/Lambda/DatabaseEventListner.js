var AWS = require("aws-sdk");
var kpiCalculator = require('./kpiCalculator');

console.log('Loading function');

exports.handler = function (event, context, callback) {
	console.log(JSON.stringify(event, null, 2));
	event.Records.forEach(function (record) {
		console.log(record.eventID);
		console.log(record.eventName);
		console.log('DynamoDB Record: %j', record.dynamodb);

		if (record.eventName == "INSERT") {
			var suctionPressure = record.dynamodb.Keys.SuctionPressure.S
			var suctionTemperature = record.dynamodb.Keys.SuctionTemperature.S
			updateDetails(suctionPressure,suctionTemperature);
		}
	});
	callback(null, "message");
};

function updateDetails(suctionPressure,suctionTemperature) {

	var table = "SignalTable";
	AWS.config.update({
		region: "ap-south-1"
	});

	var docClient = new AWS.DynamoDB.DocumentClient()

	// var suctionPressure = "18";
	// var suctionTemperature = "14";

	//Calculate KPI 
	var effeciencyRequest = {
		"suctionPressure": 100,
		"dischargePressure": 300,
		"flowRate": 600,
		"motorPowerInput": 100,
		"motorEfficiency": 0.96,
	};

	var dynamicHeadRequest = {
		"suctionPressure": 5,
		"dischargePressure": 80,
		"flowRate": 70,
		"suctionDiameter": 1.5,
		"dischargeDiameter": 1,
		"suctionHeight": 1,
		"dischargeHeight": 6,
		"density": 1
	}
	console.log(kpiCalculator.calculatePumpEffeciency(effeciencyRequest));
	console.log(kpiCalculator.calculateDynamicHead(dynamicHeadRequest));

	var calculatedPumpEffeciency = kpiCalculator.calculatePumpEffeciency(effeciencyRequest);
	var calculatedDynamicHead = kpiCalculator.calculateDynamicHead(dynamicHeadRequest);


	// Update the item, unconditionally,
	var params = {
		TableName: table,
		Key: {
			"SuctionPressure": suctionPressure,
			"SuctionTemperature": suctionTemperature
		},
		UpdateExpression: "set PumpEffeciency = :pumpEffeciency, DynamicHead = :dynamicHead",
		ExpressionAttributeValues: {
			":pumpEffeciency": calculatedPumpEffeciency,
			":dynamicHead": calculatedDynamicHead
		},
		ReturnValues: "UPDATED_NEW"
	};

	console.log("Updating the item...");
	docClient.update(params, function (err, data) {
		if (err) {
			console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
		} else {
			console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
		}
	});

}