var app = angular.module('monitoringApp', []);
var awsConfig = {

    "region": region,
    // "endpoint" :endpoint,
    "accessKeyId": accessKeyId,
    "secretAccessKey": secretAccessKey
};
AWS.config.update(awsConfig);
var docClient = new AWS.DynamoDB.DocumentClient();

app.controller('monitoringController', ['$scope', '$interval', function ($scope, $interval) {

    var headers = ["S. No.", "Discharge Pressure", "Discharge Temperature", "Suction Pressure", "Suction Temperature", "Fluid Flow", "Pump Effeciency", "Dynamic Head", "Time Stamp"];
    var tableData = [];

    
    $interval(function () {

        if (typeof $scope.alarms !== 'undefined' && typeof $scope.alarmParameter !== 'undefined') {
            var lastRecord = $scope.alarmParameter;

            var isEfficiencyAlarmRaised = false;
            var motorStatus = lastRecord.MotorStatus;
            if (parseFloat(lastRecord.PredictedPumpEffeciency) > parseFloat(lastRecord.PumpEffeciency)) {
                effDiff = parseFloat(lastRecord.PredictedPumpEffeciency) - parseFloat(lastRecord.PumpEffeciency);
            } else {
                effDiff = parseFloat(lastRecord.PumpEffeciency) - parseFloat(lastRecord.PredictedPumpEffeciency);
            }
            if (effDiff > 0.10 * parseFloat(lastRecord.PredictedPumpEffeciency))
                isEfficiencyAlarmRaised = true;

            var isDynamicHeadAlarm = false;
            if (parseFloat(lastRecord.PredictedDynamicHead) > parseFloat(lastRecord.DynamicHead)) {
                dynamicHeadDiff = parseFloat(lastRecord.PredictedDynamicHead) - parseFloat(lastRecord.DynamicHead);

            } else {
                dynamicHeadDiff = parseFloat(lastRecord.DynamicHead) - parseFloat(lastRecord.PredictedDynamicHead);
            }

            if (dynamicHeadDiff > 0.10 * parseFloat(lastRecord.PredictedDynamicHead))
                isDynamicHeadAlarm = true;

            var isDryRunningAlarmRaised = (motorStatus === "Dry Running")?true:false;
            var isBlockageAlarmRaised = (motorStatus === "Blockage")?true:false;

            var newAlarms = [];
            var inActiveAlarms = [];

            var isEfficiencyAlarmExist = false;
            var isDynamicHeadAlarmExist = false;
            var isBlockageAlarmExist = false;
            var isDryRunningalrmExist = false;
            
            $scope.alarms.forEach(alarmData => {

                if (parseInt(alarmData.Category) == 1)
                {
                    isEfficiencyAlarmExist = true;
                    if (!isEfficiencyAlarmRaised)
                        inActiveAlarms.push(alarmData);
                }
                if (parseInt(alarmData.Category) == 2)
                {
                    isDynamicHeadAlarmExist = true;
                    if (!isDynamicHeadAlarm)
                        inActiveAlarms.push(alarmData);
                }
                if (parseInt(alarmData.Category) == 3)
                {
                    isDryRunningalrmExist = true;
                    if (motorStatus !== "Dry Running")
                        inActiveAlarms.push(alarmData);
                }
                if (parseInt(alarmData.Category) == 4 )
                {
                    isBlockageAlarmExist = true;
                    if (motorStatus !== "Blockage")
                        inActiveAlarms.push(alarmData);
                }
                
            });

            var date = new Date();
            var timestamp = date.toLocaleString();
            var currentTime = date.getTime();
            if(isEfficiencyAlarmRaised && !isEfficiencyAlarmExist)
            {
               var  alarmData = {
                "Id": currentTime,
                "Name":"Efficiency Off-track",
                "TimeStamp": timestamp,
                "AlarmStatus" : "Active",
                "Category" : "1",
                "Type" : "Measured Fault"}
                newAlarms.push(alarmData);  
            }
            
            if(isDynamicHeadAlarm && !isDynamicHeadAlarmExist)
            {
               var  alarmData = {
                "Id": currentTime,
                "Name":"TDH Off-track",
                "TimeStamp": timestamp,
                "AlarmStatus" : "Active",
                "Category" : "2",
                "Type" : "Measured Fault"}
                newAlarms.push(alarmData);  
            }

            if(isDryRunningAlarmRaised && !isDryRunningalrmExist)
                {
               var  alarmData = {
                "Id": currentTime,
                "Name":"Dry Running",
                "TimeStamp": timestamp,
                "AlarmStatus" : "Active",
                "Category" : "3",
                "Type" : "Operational Fault"}
                newAlarms.push(alarmData);  
            }

            if(isBlockageAlarmRaised && !isBlockageAlarmExist)
            {
               var  alarmData = {
                "Id": currentTime,
                "Name":"Blockage",
                "TimeStamp": timestamp,
                "AlarmStatus" : "Active",
                "Category" : "4",
                "Type" : "Operational Fault"}
                newAlarms.push(alarmData);  
            }   

            addOrUpdateAlarms(newAlarms,inActiveAlarms);
        }

    }, 2000);


    $interval(function () {

        var twoHoursBefore = new Date();
        twoHoursBefore.setHours(twoHoursBefore.getMinutes() - 10);
        var params = {
            TableName: "MeasuredData",
            Limit: 10,
            FilterExpression: "#Id > :from",
            ExpressionAttributeNames: {
                "#Id":"SortKey",
            },
            ExpressionAttributeValues: {
                ":from": twoHoursBefore.getTime()
            },          
            ScanIndexForward: false
        };

        docClient.scan(params, function (err, data) {
            if (err) {
                console.log("error");
            }
            else {
                console.log("success");
                tableData = [];
                var alarmParameters = [];
                for (var index = 0; index < data.Items.length; index++) {
                    var rowData = [];
                    rowData.push(index + 1);
                    rowData.push(data.Items[index].DischargePressure);
                    rowData.push(data.Items[index].DischargeTemp);
                    rowData.push(data.Items[index].SuctionPressure);
                    rowData.push(data.Items[index].SuctionTemp);
                    rowData.push(data.Items[index].FluidFlow);

                    
                    var pumpEff = String(data.Items[index].PumpEffeciency);
                    pumpEff = pumpEff.substring(0, 5);
                    rowData.push(pumpEff);

                    var dyHEad = String(data.Items[index].DynamicHead);
                    dyHEad = dyHEad.substring(0, 5);
                    rowData.push(dyHEad);

                    rowData.push(data.Items[index].TimeStamp);

                    tableData.push(rowData);

                    if (index == 0) {
                        var alarmParameter = {};
                        alarmParameter.PumpEffeciency = data.Items[index].PumpEffeciency;
                        alarmParameter.DynamicHead = data.Items[index].DynamicHead;
                        alarmParameter.MotorStatus = data.Items[index].MotorStatus;
                        alarmParameter.PredictedPumpEffeciency = data.Items[index].PredictedPumpEffeciency;
                        alarmParameter.PredictedDynamicHead = data.Items[index].PredictedDynamicHead;
                        $scope.alarmParameter = alarmParameter;
                        $scope.motorStatus = data.Items[index].MotorStatus;
                    }

                }

                $scope.headers = headers;
                $scope.tableData = tableData;
                $scope.$apply();
            }
        });
      }, 1000);

        $interval(function () {
       
            var params = {
                TableName: "AlarmTable",
                FilterExpression: "#status = :status",
                ExpressionAttributeNames: { "#status": "AlarmStatus" },
                ExpressionAttributeValues: {
                    ":status": "Active",
                }
            };

            docClient.scan(params, function (err, data) {
                if (err) {
                    console.log("error");
                }

                else {
                    console.log("success");
                    var alarms = [];
                    for (var index = 0; index < data.Items.length; index++) {
                        var alarmData = {};

                        alarmData.Name = data.Items[index].Name;
                        alarmData.TimeStamp = data.Items[index].TimeStamp;
                        alarmData.AlarmStatus = data.Items[index].AlarmStatus;
                        alarmData.Category = data.Items[index].Category;
                        alarmData.Type = data.Items[index].Type;
                        alarmData.Id = data.Items[index].Id;

                        alarms.push(alarmData);
                    }
                    $scope.alarms = alarms;
                    $scope.$apply();
                }
            });
          }, 2000);
   



}]);

function addOrUpdateAlarms(newAlarms,inActiveAlarms)
{ 
    inActiveAlarms.forEach(alarmData => {
        inActivateAlarm(alarmData);
    });

    newAlarms.forEach(alarmData => {
        createAlarm(alarmData);
    });
}

function inActivateAlarm(alarmData){
  	// Update the item, unconditionally,
	var params = {
		TableName: "AlarmTable",
		Key: {
			"Id": alarmData.Id,
		},
		UpdateExpression: "set AlarmStatus = :status",
		ExpressionAttributeValues: {
			":status": "Inactive",
		},  
		ReturnValues: "UPDATED_NEW"
	};

	console.log("Updating the item...");
	docClient.update(params, function (err, data) {
		if (err) {
			console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
		} else {
			console.log("Alarm Update succeeded:", JSON.stringify(data, null, 2));
		}
	});
}

function createAlarm(alarmData){
    var docClient = new AWS.DynamoDB.DocumentClient();
	// Update the item, unconditionally,
   var params = {
        TableName: "AlarmTable",
        Item: alarmData
    };

    console.log("Updating the item...");
	docClient.put(params, function (err, data) {
        if (err) {
            console.error("Unable to put item", ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("PutItem succeeded:");
        }
    });
}