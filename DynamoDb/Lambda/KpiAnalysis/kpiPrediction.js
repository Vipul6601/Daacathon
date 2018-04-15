var AWS = require("aws-sdk");
var regression = require("regression");

var kpiPrediction = {
        predictKPI: function (predictKPIRequest) {
                console.log("Start KPI Prediction ");
                this.getTestData(predictKPIRequest, this.updateMeasureData);
                console.log("Prediction and update of measured values finished");
        },
        getTestData: function (predictKPIRequest, callback) {
                console.log("Start getTestData. Request:"+predictKPIRequest);
                console.log("predictKPIRequest.FlowRate"+predictKPIRequest.FlowRate);
                var table = "TestData";
                AWS.config.update({
                    region: "ap-south-1"
                });

                var docClient = new AWS.DynamoDB.DocumentClient()
                var params =
                {
                    TableName : "TestData"
                };	
                docClient.scan(params, function (err, data) {
                        if (err) {
                                console.log("error");
                        }
                        else {
                                var efficiencyDataSet = [];
                                var tdhDataSet = [];

                                for (var index = 0; index < data.Items.length; index++) {
                                        var efficiencyData = [];
                                        efficiencyData.push(parseFloat(data.Items[index].FluidFlow));
                                        efficiencyData.push(parseFloat(data.Items[index].Efficiency));
                                        console.log("efficiencyData"+efficiencyData);
                                        efficiencyDataSet.push(efficiencyData);

                                        var tdhData = [];
                                        tdhData.push(parseFloat(data.Items[index].FluidFlow));
                                        tdhData.push(parseFloat(data.Items[index].TDH));
                                        console.log("tdhData"+tdhData);
                                        tdhDataSet.push(tdhData);
                                }

                                const efficiencyResult = regression.polynomial(efficiencyDataSet);
                                const efficiencyGradient = efficiencyResult.equation[0];
                                const efficiencyYIntercept = efficiencyResult.equation[1];
                                var predictedPumpEfcncy= efficiencyResult.predict(parseFloat(predictKPIRequest.FlowRate))[1];
                                console.log("efficiencyGradient :"+ efficiencyGradient);
                                console.log("efficiencyYIntercept :"+ efficiencyYIntercept);
                                console.log("predictedPumpEfcncy :"+ predictedPumpEfcncy);


                                const tdhResult = regression.linear(tdhDataSet);
                                const tdhGradient = tdhResult.equation[0];
                                const tdhYIntercept = tdhResult.equation[1];
                                var predictedPumpTDH = tdhResult.predict(parseFloat(predictKPIRequest.FlowRate))[1];
                               
                                console.log("predictedPumpTDH :"+ predictedPumpTDH);
                                console.log("tdhGradient :"+ tdhGradient);
                                console.log("tdhYIntercept :"+ tdhYIntercept);

                                predictKPIRequest.PredictedPumpEffeciency = predictedPumpEfcncy;
                                predictKPIRequest.PredictedDynamicHead = predictedPumpTDH;
                                //Calling callback function
                                callback(predictKPIRequest);
                        }
                })

        },
        updateMeasureData: function (updateMeasDataRequest) {
                console.log("updateMeasureData callback function started :: Request");
                console.log("predictedPumpEffeciency"+updateMeasDataRequest.predictedPumpEffeciency);
                console.log("predictedDynamicHead"+updateMeasDataRequest.predictedDynamicHead);

                var table = "MeasuredData";
                AWS.config.update({
                        region: "ap-south-1"
                });

                var docClient = new AWS.DynamoDB.DocumentClient()

                var params = {
                        TableName: table,
                        Key: {
                                "Id": updateMeasDataRequest.Id,
                                "SortKey":parseInt(updateMeasDataRequest.SortKey)
                        },
                        UpdateExpression: "set PumpEffeciency = :pumpEffeciency, DynamicHead = :dynamicHead, MotorStatus = :motorStatus, PredictedPumpEffeciency = :predictedPumpEffeciency, PredictedDynamicHead = :predictedDynamicHead",
                        ExpressionAttributeValues: {
                                ":pumpEffeciency": updateMeasDataRequest.PumpEffeciency,
                                ":dynamicHead": updateMeasDataRequest.DynamicHead,
                                ":motorStatus": updateMeasDataRequest.MotorStatus,
                                ":predictedPumpEffeciency": updateMeasDataRequest.PredictedPumpEffeciency,
                                ":predictedDynamicHead": updateMeasDataRequest.PredictedDynamicHead
                        },
                        ReturnValues: "UPDATED_NEW"
                };
                console.log("Updating the item...");
                docClient.update(params, function (err, data) {
                        if (err) {
                                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                        } else {
                                // Start Prediction
                                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                        }
                });
        }

};

console.log('[@kpiPrediction] kpiPrediction = ', kpiPrediction);
module.exports = kpiPrediction;