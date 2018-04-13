var app = angular.module('monitoringApp', []);


var awsConfig = {

    "region": region,
    // "endpoint" :endpoint,
    "accessKeyId": accessKeyId,
    "secretAccessKey": secretAccessKey
};
AWS.config.update(awsConfig);
var docClient = new AWS.DynamoDB.DocumentClient();

app.controller('monitoringController', ['$scope', '$interval', function ($scope,$interval) {
    //$scope.tableData = {}; 
    var headers = ["S. No.", "Discharge Pressure", "Discharge Temperature", "Suction Pressure", "Suction Temperature", "Fluid Flow", "Pump Effeciency", "Dynamic Head", "Time Stamp"];
    var tableData = [];

    var params = {
        TableName: "MeasuredData"
    };

    docClient.scan(params, function (err, data) {
        if (err) {
            console.log("error");
        }
        else {
            console.log("success");
            tableData = [];
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

                if (index == data.Items.length - 1) {
                    $scope.motorStatus = data.Items[index].MotorStatus;
                }

            }

            $scope.headers = headers;
            $scope.tableData = tableData;
            $scope.$apply();
        }

        $interval(function(){
            var params = {
                TableName: "AlarmTable"
            };
        
            docClient.scan(params, function (err, data) {
                if (err) {
                    console.log("error");
                }
                else {
                    console.log("success");
                   var alarms = [];
                    for (var index = 0; index < data.Items.length; index++) {
                        var alarmData= {};
                        
                        alarmData.Name = data.Items[index].Name;
                        alarmData.TimeStamp = data.Items[index].TimeStamp;
                        alarmData.Status = data.Items[index].Status;
                        alarmData.Type  = data.Items[index].Type;
                        alarms.push(alarmData);
        
                   }
        
                    $scope.alarms = alarms;
                    $scope.$apply();
                }
            });
        }, 5000);
    });


}]);
