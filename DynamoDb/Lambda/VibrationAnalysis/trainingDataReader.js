var AWS = require("aws-sdk");
var trainingDataReader = {

    getTrainingDataImpellar: function (predictionRequestId,testingFilteredSet,predictionCallBack,impellarWearCombination) {

        var table = "";
        if(impellarWearCombination == 1)
            table = "VibrationTrainingImpellar1";
        else if(impellarWearCombination == 2)
            table =  "VibrationTrainingImpellar2";
        else if(impellarWearCombination == 3)
            table = "VibrationTrainingImpellar3";
        else
            table = "";   

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