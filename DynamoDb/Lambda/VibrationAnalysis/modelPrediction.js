var jsregression = require('js-regression');

// === Create the linear regression === //
var logistic = new jsregression.LogisticRegression({
    alpha: 0.01,
    iterations: 10000,
    lambda: 0.0
});

var modelPrediction = {

    predictImpellarDefect: function (trainingSets, testingSet, impellarCombination) {
        var trainingFeatureSets = [];
        trainingSets.forEach(trainingSet => {
                var trainingFeatureSet = [];
                trainingFeatureSet.push(parseFloat(trainingSet.DefectFrequency1.Amplitude));
                trainingFeatureSet.push(parseFloat(trainingSet.DefectFrequency2.Amplitude));
                if(impellarCombination != 2)
                {
                    trainingFeatureSet.push(parseFloat(trainingSet.DefectFrequency3.Amplitude));
                    trainingFeatureSet.push(parseFloat(trainingSet.DefectFrequency4.Amplitude));
                }
                if(impellarCombination != 1)
                {
                    trainingFeatureSet.push(parseFloat(trainingSet.DefectFrequency5.Amplitude));
                    trainingFeatureSet.push(parseFloat(trainingSet.DefectFrequency6.Amplitude));
                }
                trainingFeatureSet.push(parseFloat(trainingSet.DefectFrequency7.Amplitude));

                if (trainingSet.Fault == "TRUE")
                    trainingFeatureSet.push(1)
                else
                    trainingFeatureSet.push(0);

                console.log(trainingFeatureSet);
                trainingFeatureSets.push(trainingFeatureSet);
        });



        // === Train the logistic regression === //
        var model = logistic.fit(trainingFeatureSets);

        // === Print the trained model === //
        // console.log("predictImpellar3Defect model config" + model.config);
        // console.log("predictImpellar3Defect model cost" + model.cost);
        // console.log("predictImpellar3Defect model theta" + model.theta);

        // Testing Set
        var testingFeatureSet = [];
        testingFeatureSet.push(parseFloat(testingSet.DefectFrequency1.Amplitude));
        testingFeatureSet.push(parseFloat(testingSet.DefectFrequency2.Amplitude));
        if(impellarCombination != 2)
        {
            testingFeatureSet.push(parseFloat(testingSet.DefectFrequency3.Amplitude));
            testingFeatureSet.push(parseFloat(testingSet.DefectFrequency4.Amplitude));
        }
        if(impellarCombination != 1)
        {
            testingFeatureSet.push(parseFloat(testingSet.DefectFrequency5.Amplitude));
            testingFeatureSet.push(parseFloat(testingSet.DefectFrequency6.Amplitude));
        }
        testingFeatureSet.push(parseFloat(testingSet.DefectFrequency7.Amplitude));

        console.log("Test LOg"+testingFeatureSet)
        var probabilityOfDefect = logistic.transform(testingFeatureSet);
        var predicted = logistic.transform(testingFeatureSet) >= 0.5 ? 1 : 0;

        console.log("predictImpellar3Defect actual probability" + probabilityOfDefect);
        console.log("predictImpellar3Defect logistic.threshold" + logistic.threshold);
        console.log("predictImpellar3Defect predicted: " + predicted);

        return predicted;
    }
};
console.log('[@modelPrediction] modelPrediction = ', modelPrediction);
module.exports = modelPrediction;