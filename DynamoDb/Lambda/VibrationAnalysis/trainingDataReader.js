var AWS = require("aws-sdk");
var trainingDataReader = {

    getTrainingDataImpellar3: function (predictionRequestId,testingFilteredSet,predictionCallBack,impellarWearCombination) {

        var table = "VibrationTrainingImpellar3";
        AWS.config.update({
            region: "ap-south-1",
            accessKeyId : "AKIAICOZGTNXCIHPQWGQ",
            secretAccessKey : "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"	
        });

        var docClient = new AWS.DynamoDB.DocumentClient();
        var params = {
            TableName: table
        };
        tableData = [];
        docClient.scan(params, function (err, data) {
            if (err) {
                console.log("error");
            }
            else {
                console.log("success");
           
                var amplitude = [];
                var time = [];
                var frequency = [];
                data.Items.sort(function(a, b) {
                    return parseFloat(a.SortKey) - parseFloat(b.SortKey);
                });

                for (var index = 0; index < data.Items.length; index++) {
                    var rowData = {};
                    rowData.Amplitude = data.Items[index].Amplitude;
                    rowData.Frequency = data.Items[index].Frequency;
                    rowData.Time  = data.Items[index].Time;
                    rowData.Fault  = data.Items[index].Fault;
                    tableData.push(rowData);
                } 
            }
            console.log("calling predictionCallBack impellarWearCombination::"+impellarWearCombination + "testingFilteredSet" + testingFilteredSet)
            predictionCallBack(predictionRequestId,tableData,testingFilteredSet,impellarWearCombination);
        });
    },
    getTrainingDataImpellar2: function (predictionRequestId,testingFilteredSet,predictionCallBack) {

        var table = "VibrationTrainingImpellar2";
        AWS.config.update({
            region: "ap-south-1",
            accessKeyId : "AKIAICOZGTNXCIHPQWGQ",
            secretAccessKey : "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"	
        });

        var docClient = new AWS.DynamoDB.DocumentClient();
        var params = {
            TableName: table
        };
        tableData = [];
        docClient.scan(params, function (err, data) {
            if (err) {
                console.log("error");
            }
            else {
                console.log("success");
           
                var amplitude = [];
                var time = [];
                var frequency = [];
                data.Items.sort(function(a, b) {
                    return parseFloat(a.SortKey) - parseFloat(b.SortKey);
                });

                for (var index = 0; index < data.Items.length; index++) {
                    var rowData = {};
                    rowData.Amplitude = data.Items[index].Amplitude;
                    rowData.Frequency = data.Items[index].Frequency;
                    rowData.Time  = data.Items[index].Time;
                    rowData.Fault  = data.Items[index].Fault;
                    tableData.push(rowData);
                } 
            }
            console.log('calling prediction call back of impellar 2')
            predictionCallBack(predictionRequestId,tableData,testingFilteredSet);
        });
    },
    getTrainingDataImpellar1: function (predictionRequestId,testingFilteredSet,predictionCallBack) {

        var table = "VibrationTrainingImpellar1";
     

        AWS.config.update({
            region: "ap-south-1",
            accessKeyId : "AKIAICOZGTNXCIHPQWGQ",
            secretAccessKey : "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"	
        });

        var docClient = new AWS.DynamoDB.DocumentClient();
        var params = {
            TableName: table
        };
        tableData = [];
        docClient.scan(params, function (err, data) {
            if (err) {
                console.log("error");
            }
            else {
                console.log("success");
           
                var amplitude = [];
                var time = [];
                var frequency = [];
                data.Items.sort(function(a, b) {
                    return parseFloat(a.SortKey) - parseFloat(b.SortKey);
                });

                for (var index = 0; index < data.Items.length; index++) {
                    var rowData = {};
                    rowData.Amplitude = data.Items[index].Amplitude;
                    rowData.Frequency = data.Items[index].Frequency;
                    rowData.Time  = data.Items[index].Time;
                    rowData.Fault  = data.Items[index].Fault;
                    tableData.push(rowData);
                } 
            }
            console.log('calling prediction call back of impellar 1')
            predictionCallBack(predictionRequestId,tableData,testingFilteredSet);
        });
    },
    getTestingData: function (predictionRequestId,testingCallBack) {

        var table = "VibrationTesting";

        AWS.config.update({
            region: "ap-south-1",
            accessKeyId : "AKIAICOZGTNXCIHPQWGQ",
            secretAccessKey : "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"	
        });

        var docClient = new AWS.DynamoDB.DocumentClient();
        var params = {
            TableName: table,
            ScanIndexForward: false
        };

        tableData = [];
        docClient.scan(params, function (err, data) {
            if (err) {
                console.log("error");
            }
            else {
                console.log("success");
           
                var amplitude = [];
                var time = [];
                var frequency = [];

                data.Items.sort(function(a, b) {
                    return parseFloat(a.SortKey) - parseFloat(b.SortKey);
                });

                for (var index = 0; index < data.Items.length; index++) {
                    var rowData = {};
                    rowData.Amplitude = data.Items[index].Amplitude;
                    rowData.Frequency = data.Items[index].Frequency;
                    rowData.Time  = data.Items[index].Time;
                    tableData.push(rowData);
                }
            }
            console.log(tableData.length);
            testingCallBack(predictionRequestId,tableData);
        });
    }

};
console.log('[@trainingDataReader] trainingDataReader = ', trainingDataReader);
module.exports = trainingDataReader;