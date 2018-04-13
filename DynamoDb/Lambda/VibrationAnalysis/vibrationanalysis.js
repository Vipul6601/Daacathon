var AWS = require("aws-sdk");
var trainingDataReader = require('./trainingDataReader');
var setBuilder = require('./setBuilder');
var frequencyAnalyser = require('./frequencyAnalyser');
var modelPrediction = require('./modelPrediction');

console.log('Loading function');

var predictionCallBack = function (tableData, testingFilteredSet, impellarWearCombination) {
    console.log("predictionCallBack :: tableData Length"+tableData.length);
    var modelSets = setBuilder.buildSet(tableData);
    console.log("predictionCallBack :: modelSets Length"+modelSets.length);
    var modelFilteredSets = frequencyAnalyser.generateAnalysedSets(modelSets);

     modelFilteredSets.forEach(element => {
         console.log("dd"+element.Fault);
     });
    console.log("predictionCallBack :: modelFilteredSets Length"+modelFilteredSets.length);

    console.log("modelFilteredSets[0]" + modelFilteredSets[0].DefectFrequency1.Amplitude);
    
    var predicted;
    if (impellarWearCombination == 1)
        predicted = modelPrediction.predictImpellarDefect(modelFilteredSets, testingFilteredSet,impellarWearCombination);

    if (impellarWearCombination == 2)
        predicted =  modelPrediction.predictImpellarDefect(modelFilteredSets, testingFilteredSet,impellarWearCombination);

    if (impellarWearCombination == 3)
        predicted = modelPrediction.predictImpellarDefect(modelFilteredSets, testingFilteredSet,impellarWearCombination);

};

var testingDataCallBack = function (tableData) {
      console.log("testingDataCallBack function");
    var testingSets = setBuilder.buildSet(tableData);
    var testingFilteredSets = frequencyAnalyser.generateAnalysedSets(testingSets);
    
    //  testingFilteredSets.forEach(element => {
    //      console.log(element);
    // });
    
     if (testingFilteredSets.length > 0) {
        var impellarWearCombination = testingFilteredSets[0].impellarCombination;
        console.log("testingDataCallBack :: impellarWearCombination"+impellarWearCombination);
        if (impellarWearCombination == 1) {
            console.log("testingDataCallBack :: Calling getTrainingDataImpellar 1 function");
            trainingDataReader.getTrainingDataImpellar(testingFilteredSets[0], predictionCallBack, 1);
        }
        else if (impellarWearCombination == 2) {
            console.log("testingDataCallBack :: Calling getTrainingDataImpellar 2 function");
            trainingDataReader.getTrainingDataImpellar(testingFilteredSets[0], predictionCallBack, 2);
        }
        else if (impellarWearCombination == 3) {
            console.log("testingDataCallBack:: Calling getTrainingDataImpellar 3 function");
            trainingDataReader.getTrainingDataImpellar(testingFilteredSets[0], predictionCallBack, 3);
        }
    }
};

trainingDataReader.getTestingData(testingDataCallBack);

