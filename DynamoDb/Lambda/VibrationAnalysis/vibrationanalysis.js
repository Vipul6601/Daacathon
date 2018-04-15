var AWS = require("aws-sdk");
var trainingDataReader = require('./trainingDataReader');
var setBuilder = require('./setBuilder');
var frequencyAnalyser = require('./frequencyAnalyser');
var modelPrediction = require('./modelPrediction');

console.log('Loading function');

var predictionCallBack1 = function (predictionRequestId, tableData, testingFilteredSet) {
    console.log("predictionCallBack is 1 :: tableData Length" + tableData.length);
    var modelSets = setBuilder.buildSet(tableData);
    console.log("predictionCallBack is 1 :: modelSets Length" + modelSets.length);
    var modelFilteredSets = frequencyAnalyser.generateAnalysedSets(modelSets);

    modelFilteredSets.forEach(element => {
        console.log("fault " + element.Fault);
    });
    console.log("predictionCallBack1 :: modelFilteredSets Length" + modelFilteredSets.length);

    console.log("modelFilteredSets[0]" + modelFilteredSets[0].DefectFrequency1.Amplitude);

    var predicted = -1;

    predicted = modelPrediction.predictImpellarDefect(modelFilteredSets, testingFilteredSet, 1);

    console.log("Stage 1 prediction" + predicted);
    if (predicted == 0)
    {
        console.log('defect not found in category 1');
        predictionOutput = "Healthy";
    }
    else if(predicted == 1)
    { 
        console.log('defect found in category 1');
        predictionOutput = "Fault";
    }else{
        predictionOutput = "Unrecognised"
    }
    updatePredictionTable(predictionRequestId,predictionOutput,1); 

};

var predictionCallBack2 = function (predictionRequestId, tableData, testingFilteredSet) {
    console.log("predictionCallBack is 2 :: tableData Length" + tableData.length);
    var modelSets = setBuilder.buildSet(tableData);
    console.log("predictionCallBack is 2 :: modelSets Length" + modelSets.length);
    var modelFilteredSets = frequencyAnalyser.generateAnalysedSets(modelSets);

    modelFilteredSets.forEach(element => {
        console.log("fault " + element.Fault);
    });
    console.log("predictionCallBack2 :: modelFilteredSets Length" + modelFilteredSets.length);

    console.log("modelFilteredSets[0]" + modelFilteredSets[0].DefectFrequency1.Amplitude);

    var predicted = -1;

    predicted = modelPrediction.predictImpellarDefect(modelFilteredSets, testingFilteredSet, 2);

    console.log("Stage 2 prediction" + predicted);
    if (predicted == 0)
    {
        console.log('defect not found in category 2 calling category 1');
        trainingDataReader.getTrainingDataImpellar1(predictionRequestId, testingFilteredSet, predictionCallBack1);
    }
    else if(predicted == 1)
    { 
        console.log('defect found in category 2');
        predictionOutput = "Fault";
        updatePredictionTable(predictionRequestId,predictionOutput,2); 
    }
  
};

var predictionCallBack3 = function (predictionRequestId, tableData, testingFilteredSet, impellarWearCombination) {
    console.log("predictionCallBack is 3 :: tableData Length" + tableData.length);
    var modelSets = setBuilder.buildSet(tableData);
    console.log("predictionCallBack is 3 :: modelSets Length" + modelSets.length);
    var modelFilteredSets = frequencyAnalyser.generateAnalysedSets(modelSets);

    modelFilteredSets.forEach(element => {
        console.log("fault " + element.Fault);
    });
    console.log("predictionCallBack3 :: modelFilteredSets Length" + modelFilteredSets.length);

    console.log("modelFilteredSets[0]" + modelFilteredSets[0].DefectFrequency1.Amplitude);

    var predicted = -1;

    predicted = modelPrediction.predictImpellarDefect(modelFilteredSets, testingFilteredSet, 3);

    console.log("Stage 3 prediction" + predicted);
    if (predicted == 0)
    {
        //Call for prediction in stage 2
        console.log('defect not found in category 3 calling category 2');
        trainingDataReader.getTrainingDataImpellar2(predictionRequestId, testingFilteredSet, predictionCallBack2);
    }
    else if(predicted == 1)
    { 
        predictionOutput = "Fault";
        updatePredictionTable(predictionRequestId,predictionOutput,3); 
    }
  
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
        trainingDataReader.getTrainingDataImpellar3(predictionRequestId, testingFilteredSets[0], predictionCallBack3, 1);
        // if (impellarWearCombination == 1) {
        //     console.log("testingDataCallBack :: Calling getTrainingDataImpellar 1 function");
        //     trainingDataReader.getTrainingDataImpellar3(predictionRequestId, testingFilteredSets[0], predictionCallBack, 1);
        // }
        // else if (impellarWearCombination == 2) {
        //     console.log("testingDataCallBack :: Calling getTrainingDataImpellar 2 function");
        //     trainingDataReader.getTrainingDataImpellar(predictionRequestId, testingFilteredSets[0], predictionCallBack, 2);
        // }
        // else if (impellarWearCombination == 3) {
        //     console.log("testingDataCallBack:: Calling getTrainingDataImpellar 3 function");
        //     trainingDataReader.getTrainingDataImpellar(predictionRequestId, testingFilteredSets[0], predictionCallBack, 3);
        // }
    }
};

function updatePredictionTable(predictionRequestId,predictionOutput,category)
{
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
            ":category": category,
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




