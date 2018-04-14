var AWS = require("aws-sdk");
var trainingDataReader = require('./trainingDataReader');
var setBuilder = require('./setBuilder');
var frequencyAnalyser = require('./frequencyAnalyser');
var modelPrediction = require('./modelPrediction');

console.log('Loading function');

var predictionCallBack = function (predictionRequestId, tableData, testingFilteredSet, impellarWearCombination) {
    console.log("predictionCallBack :: tableData Length" + tableData.length);
    var modelSets = setBuilder.buildSet(tableData);
    console.log("predictionCallBack :: modelSets Length" + modelSets.length);
    var modelFilteredSets = frequencyAnalyser.generateAnalysedSets(modelSets);

    modelFilteredSets.forEach(element => {
        console.log("dd" + element.Fault);
    });
    console.log("predictionCallBack :: modelFilteredSets Length" + modelFilteredSets.length);

    console.log("modelFilteredSets[0]" + modelFilteredSets[0].DefectFrequency1.Amplitude);

    var predicted = -1;
    if (impellarWearCombination == 1)
        predicted = modelPrediction.predictImpellarDefect(modelFilteredSets, testingFilteredSet, impellarWearCombination);

    if (impellarWearCombination == 2)
        predicted = modelPrediction.predictImpellarDefect(modelFilteredSets, testingFilteredSet, impellarWearCombination);

    if (impellarWearCombination == 3)
        predicted = modelPrediction.predictImpellarDefect(modelFilteredSets, testingFilteredSet, impellarWearCombination);

    var predictionOutput;

    if(predicted = 1)
    {
        predictionOutput = "Fault";
    }else if(predicted = 0)
    {
        predictionOutput = "Healthy"
    }else{
        predictionOutput = "No Matching Category";
    }

    var table = "PredictionTable";
    AWS.config.update({
        region: "ap-south-1"
    });

    var docClient = new AWS.DynamoDB.DocumentClient()
    var params = {
        TableName: table,
        Key: {
            "Id": predictionRequestId,
        },
        UpdateExpression: "set PredictionOutput = :predictionOutput, Category = :category",
        ExpressionAttributeValues: {
            ":predictionOutput": predictionOutput,
            ":category": impellarWearCombination,
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

};

var testingDataCallBack = function (predictionRequestId, tableData) {
    console.log("testingDataCallBack function");
    var testingSets = setBuilder.buildSet(tableData);
    var testingFilteredSets = frequencyAnalyser.generateAnalysedSets(testingSets);

    //  testingFilteredSets.forEach(element => {
    //      console.log(element);
    // });

    if (testingFilteredSets.length > 0) {
        var impellarWearCombination = testingFilteredSets[0].impellarCombination;
        console.log("testingDataCallBack :: impellarWearCombination" + impellarWearCombination);
        if (impellarWearCombination == 1) {
            console.log("testingDataCallBack :: Calling getTrainingDataImpellar 1 function");
            trainingDataReader.getTrainingDataImpellar(predictionRequestId, testingFilteredSets[0], predictionCallBack, 1);
        }
        else if (impellarWearCombination == 2) {
            console.log("testingDataCallBack :: Calling getTrainingDataImpellar 2 function");
            trainingDataReader.getTrainingDataImpellar(predictionRequestId, testingFilteredSets[0], predictionCallBack, 2);
        }
        else if (impellarWearCombination == 3) {
            console.log("testingDataCallBack:: Calling getTrainingDataImpellar 3 function");
            trainingDataReader.getTrainingDataImpellar(predictionRequestId, testingFilteredSets[0], predictionCallBack, 3);
        }
    }
};

exports.handler = function (event, context, callback) {
    console.log(JSON.stringify(event, null, 2));

    event.Records.forEach(function (record) {
        console.log(record.eventID);
        console.log(record.eventName);
        console.log('DynamoDB Record: %j', record.dynamodb);

        if (record.eventName == "INSERT") {

            var predictionRequestId = record.dynamodb.NewImage.Id.S;
            trainingDataReader.getTestingData(predictionRequestId, testingDataCallBack);
        }
    });
    callback(null, "message");
};




