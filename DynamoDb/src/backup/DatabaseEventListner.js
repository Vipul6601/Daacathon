var AWS = require("aws-sdk");
var kpiCalculator = require('./kpiCalculator');
var kpiPrediction = require('./kpiPrediction');

console.log('Loading function');

exports.handler = function (event, context, callback) {
	console.log(JSON.stringify(event, null, 2));
	event.Records.forEach(function (record) {
		console.log(record.eventID);
		console.log(record.eventName);
		console.log('DynamoDB Record: %j', record.dynamodb);

		if (record.eventName == "INSERT") {
			var id = record.dynamodb.Keys.Id.S;

			var suctionPressure = parseInt(record.dynamodb.NewImage.SuctionPressure.S);
			var dischargePressure = parseInt(record.dynamodb.NewImage.DischargePressure.S);
			var flowRate = parseInt(record.dynamodb.NewImage.FluidFlow.S);
			var motorPowerInput = parseInt(record.dynamodb.NewImage.ElectricPower.S);

			var effeciencyRequest = {
				"suctionPressure": suctionPressure,
				"dischargePressure": dischargePressure,
				"flowRate": flowRate,
				"motorPowerInput": motorPowerInput,
				"motorEfficiency": 0.96,
			};

			var dynamicHeadRequest = {
				"suctionPressure": suctionPressure,
				"dischargePressure": dischargePressure,
				"flowRate": flowRate,
				"suctionDiameter": 1.5,
				"dischargeDiameter": 1,
				"suctionHeight": 1,
				"dischargeHeight": 6,
				"density": 1
			}
			var motorStatusRequest = {
				"suctionPressure": suctionPressure,
				"dischargePressure": dischargePressure,
				"flowRate": flowRate
			}

			updateDetails(id, effeciencyRequest, dynamicHeadRequest, motorStatusRequest);

		}
	});
	callback(null, "message");
};


function updateDetails(id, effeciencyRequest, dynamicHeadRequest, motorStatusRequest) {

	var table = "MeasuredData";
	AWS.config.update({
		region: "ap-south-1"
	});

	var docClient = new AWS.DynamoDB.DocumentClient()

	console.log("id" + id);
	console.log("effeciencyRequest" + effeciencyRequest);
	console.log("dynamicHeadRequest" + dynamicHeadRequest);

	var calculatedPumpEffeciency = kpiCalculator.calculatePumpEffeciency(effeciencyRequest);
	var calculatedDynamicHead = kpiCalculator.calculateDynamicHead(dynamicHeadRequest);
	var calculatedMotorStatus = kpiCalculator.calculateMotorStatus(motorStatusRequest);

	console.log("calculatedPumpEffeciency" + calculatedPumpEffeciency);
	console.log("calculatedDynamicHead" + calculatedDynamicHead);
	console.log("calculatedMotorStatus" + calculatedMotorStatus);


	// Update the item, unconditionally,
	var params = {
		TableName: table,
		Key: {
			"Id": id,
		},
		UpdateExpression: "set PumpEffeciency = :pumpEffeciency, DynamicHead = :dynamicHead, MotorStatus = :motorStatus",
		ExpressionAttributeValues: {
			":pumpEffeciency": calculatedPumpEffeciency,
			":dynamicHead": calculatedDynamicHead,
			":motorStatus": calculatedMotorStatus
		},
		ReturnValues: "UPDATED_NEW"
	};

	console.log("Updating the item...");
	docClient.update(params, function (err, data) {
		if (err) {
			console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
		} else {
			// Start Prediction
			var predictKPIRequest = {
				"Id": id,
				"PumpEffeciency": calculatedPumpEffeciency,
				"DynamicHead": calculatedDynamicHead,
				"MotorStatus": calculatedMotorStatus,
				"FlowRate":effeciencyRequest.flowRate
			}
			kpiPrediction.predictKPI(predictKPIRequest);
			console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
		}
	});

}