var app = angular.module('vibrationApp', []);

app.controller('vibrationController', function ($scope,$interval) {
    //$scope.tableData = {}; 
    var headers = ["Amplitude", "Time", "Frequency"];
    var tableData = [];
    var pollingPrediction;

    var awsConfig = {

        "region": region,
        // "endpoint" :endpoint,
        "accessKeyId": accessKeyId,
        "secretAccessKey": secretAccessKey
    };
    AWS.config.update(awsConfig);
    var docClient = new AWS.DynamoDB.DocumentClient();

    $scope.ExportToTable = function () {
        tableData = loadExcelFile("#impellar1Data", "VibrationTrainingImpellar1", false);

        tableData = loadExcelFile("#impellar2Data", "VibrationTrainingImpellar2", false);

        tableData = loadExcelFile("#impellar3Data", "VibrationTrainingImpellar3", false);
    };

    $scope.UploadTestData = function () {
        tableData = loadExcelFile("#testData", "VibrationTesting", true);
    };

    $scope.getDataFromDynamoDb = function () {
        getTestingDataFromDynamoDB();
    }
    $scope.plotGraph = function () {
        plotAmpFreqGraph();
    }

    function loadExcelFile(fileName, tableName, isTestingData) {
        var tableData = [];
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;

        /*Checks whether the file is a valid excel file*/
        if (regex.test($(fileName).val().toLowerCase())) {
            var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/
            if ($(fileName).val().toLowerCase().indexOf(".xlsx") > 0) {
                xlsxflag = true;
            }
            /*Checks whether the browser supports HTML5*/
            if (typeof (FileReader) != "undefined") {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var data = e.target.result;
                    /*Converts the excel data in to object*/
                    if (xlsxflag) {
                        var workbook = XLSX.read(data, { type: 'binary' });
                    }
                    else {
                        var workbook = XLS.read(data, { type: 'binary' });
                    }
                    /*Gets all the sheetnames of excel in to a variable*/
                    var sheet_name_list = workbook.SheetNames;

                    var cnt = 0; /*This is used for restricting the script to consider only first sheet of excel*/

                    sheet_name_list.forEach(function (y) { /*Iterate through all sheets*/
                        /*Convert the cell value to Json*/
                        if (xlsxflag) {
                            var exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                        }
                        else {
                            var exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
                        }
                        if (exceljson.length > 0 && cnt == 0) {

                            if (isTestingData)
                                tableData = getTableSheetTestingData(exceljson, tableName);
                            else
                                tableData = getTableSheetData(exceljson, tableName);
                            updateRecordInDynamoDb(tableData, isTestingData);

                            cnt++;
                        }
                    });
                }
                if (xlsxflag) {/*If excel file is .xlsx extension than creates a Array Buffer from excel*/
                    reader.readAsArrayBuffer($(fileName)[0].files[0]);
                }
                else {
                    reader.readAsBinaryString($(fileName)[0].files[0]);
                }
            }
            else {
                alert("Sorry! Your browser does not support HTML5!");
            }
        }
        else {
            console.log("Please upload a valid Excel file!");
        }

        return tableData;
    }


    function getTableSheetData(jsondata, tableName) {/*Function used to convert the JSON array to Html Table*/

        var columns = getColumnHeaders(jsondata); /*Gets all the column headings of Excel*/
        var sheetData = [];
        for (var i = 0; i < jsondata.length; i++) {
            var rowData = [];
            var params;
            var amplitude, time, frequency, fault;

            for (var colIndex = 0; colIndex < columns.length; colIndex++) {
                var cellValue = jsondata[i][columns[colIndex]];
                if (cellValue == null)
                    cellValue = "";

                if (colIndex === 0)
                    amplitude = cellValue;
                else if (colIndex === 1)
                    time = cellValue;
                else if (colIndex === 2)
                    frequency = cellValue;
                else if (colIndex === 3)
                    fault = cellValue;
            }
            params = {
                TableName: tableName,
                Item: {
                    "Id": i + "",
                    "SortKey": i,
                    "Amplitude": amplitude,
                    "Time": time,
                    "Frequency": frequency,
                    "Fault": fault
                }
            }
            sheetData.push(params);
        }

        return sheetData;
    }

    function getTableSheetTestingData(jsondata, tableName) {/*Function used to convert the JSON array to Html Table*/

        var columns = getColumnHeaders(jsondata); /*Gets all the column headings of Excel*/
        var sheetData = [];
        for (var i = 0; i < jsondata.length; i++) {
            var rowData = [];
            var params;
            var amplitude, time, frequency, fault;

            for (var colIndex = 0; colIndex < columns.length; colIndex++) {
                var cellValue = jsondata[i][columns[colIndex]];
                if (cellValue == null)
                    cellValue = "";

                if (colIndex === 0)
                    amplitude = cellValue;
                else if (colIndex === 1)
                    time = cellValue;
                else if (colIndex === 2)
                    frequency = cellValue;

            }
            params = {
                TableName: tableName,
                Item: {
                    "Id": i + "",
                    "SortKey": i,
                    "Amplitude": amplitude,
                    "Time": time,
                    "Frequency": frequency,
                }
            }
            sheetData.push(params);
        }

        return sheetData;
    }

    function getColumnHeaders(jsondata) {/*Function used to get all column names from JSON and bind the html table header*/
        var columnSet = [];
        for (var i = 0; i < jsondata.length; i++) {
            var rowHash = jsondata[i];
            for (var key in rowHash) {
                if (rowHash.hasOwnProperty(key)) {
                    if ($.inArray(key, columnSet) == -1) {
                        /*Adding each unique column names to a variable array*/
                        columnSet.push(key);
                    }
                }
            }
        }
        return columnSet;
    }

    function updateRecordInDynamoDb(tableData, isTestingData) {

        if (tableData.length > 0)
            putRecordInDynamoDb(tableData, docClient, isTestingData);
    }

    function putRecordInDynamoDb(allParams, docClient, isTestingData) {
        var params = allParams.pop();
        docClient.put(params, function (err, data) {
            if (err) {
                console.error("Unable to put item", ". Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("PutItem succeeded:");
                if (allParams.length > 0)
                    putRecordInDynamoDb(allParams, docClient);
                else {
                    alert("Data Acquisition is successful !!!");
                    createModelPredictionReqest();
                }
            }
        });
    }


    function createModelPredictionReqest() {

        var date = new Date();
        var timestamp = date.toLocaleString();
        var currentTime = date.getTime();
        $scope.PredictionRequestId = currentTime;

        var predictionData = {
            "Id": currentTime + "",
            "PredictionRequestId": currentTime,
            "TimeStamp": timestamp,
        }

        var params = {
            TableName: "PredictionTable",
            Item: predictionData
        };

        console.log("Updating the item...");
        docClient.put(params, function (err, data) {
            if (err) {
                console.error("Unable to put item", ". Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("PutItem succeeded:");
                $scope.pollPredictionResult();
            }
        });
    }

    $scope.pollPredictionResult = function () {

        pollingPrediction = $interval(function () {
            var params = {
                TableName: "PredictionTable",
                KeyConditionExpression: "#predictionId = :id",
                ExpressionAttributeNames: {
                    "#predictionId": "Id"
                },
                ExpressionAttributeValues: {
                    ":id": $scope.PredictionRequestId+""
                }
            };

            docClient.query(params, function (err, data) {
                if (err) {
                    console.log("error");
                }
                else {
                    if (typeof data.Items[0].PredictionOutput !== 'undefined') {
                        $scope.predictionResult = data.Items[0];
                        $scope.$apply();
                        $scope.stopPollingPredictionResult();
                    }
                }

            });

        }, 2000);

    }
    $scope.stopPollingPredictionResult = function () {
        if (angular.isDefined(pollingPrediction)) {
            $interval.cancel(pollingPrediction);
            pollingPrediction = undefined;
        }
    }
    function getTestingDataFromDynamoDB() {
        var awsConfig = {

            "region": region,
            // "endpoint" :endpoint,
            "accessKeyId": accessKeyId,
            "secretAccessKey": secretAccessKey
        };
        AWS.config.update(awsConfig);
        var docClient = new AWS.DynamoDB.DocumentClient();
        var params = {
            TableName: "VibrationTesting"
        };

        docClient.scan(params, function (err, data) {
            if (err) {
                console.log("error");
            }
            else {
                console.log("success");
                tableData = [];
                var amplitude = [];
                var time = [];
                var frequency = [];

                data.Items.sort(function (a, b) {
                    return parseFloat(a.SortKey) - parseFloat(b.SortKey);
                });
                for (var index = 0; index < data.Items.length; index++) {
                    amplitude.push(data.Items[index].Amplitude);
                    time.push(data.Items[index].Time);
                    frequency.push(data.Items[index].Frequency);
                }

                plotAmpFreqGraph(amplitude, time, frequency);
            }

        });
    }

    function plotAmpFreqGraph(amplitude, time, frequency) {
        var ctx = document.getElementById("myChart").getContext('2d');

        var dataFirst = {
            label: "Frequency",
            data: frequency,
            lineTension: 0.3,
            fill: false,
            borderColor: 'red',
            backgroundColor: 'transparent',
            pointBorderColor: 'red',
            pointBackgroundColor: 'lightgreen',
            pointRadius: 5,
            pointHoverRadius: 15,
            pointHitRadius: 30,
            pointBorderWidth: 2,
            pointStyle: 'rect'
        };

        var dataSecond = {
            label: "Amplitude",
            data: amplitude,
            lineTension: 0.3,
            fill: false,
            borderColor: 'purple',
            backgroundColor: 'transparent',
            pointBorderColor: 'purple',
            pointBackgroundColor: 'lightgreen',
            pointRadius: 5,
            pointHoverRadius: 15,
            pointHitRadius: 30,
            pointBorderWidth: 2
        };

        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: time,
                datasets: [dataFirst, dataSecond]
            },
            options: {
                title: {
                    display: true,
                    text: "Time vs Amplitude vs Frequency Graph"
                },
                tooltips: {
                    mode: 'label'
                },
                responsive: true,
                scales: {
                    yAxes: [{
                        stacked: true,
                        position: "left",
                        id: "y-axis-0",
                    }, {
                        stacked: false,
                        position: "right",
                        id: "y-axis-1",
                    }]
                }
            }
        });
    }

    $scope.$on('$destroy', function () {
        // Make sure that the interval is destroyed too
        if (angular.isDefined(pollingPrediction)) {
            $interval.cancel(pollingPrediction);
            pollingPrediction = undefined;
        }
    });
});//End Controller