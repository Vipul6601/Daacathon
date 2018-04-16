var jsregression = require('js-regression');

// === Create the linear regression === //
var logistic = new jsregression.LogisticRegression({
   alpha: 0.01,
   iterations: 10000,
   lambda: 0.0
});
// can also use default configuration: var logistic = new jsregression.LogisticRegression(); 

// === Create training data and testing data ===//


var trainingData = [];
var testingData = [];

   var row1 = [];
   var row2 = [];
   var row3 = [];
   var row4 = [];
   var row5 = [];
   var row6 = [];
   var row7 = [];
   var row8 = [];
   var row9 = [];
   var row10 = [];

row1.push(2.21675342);	row1.push(0.0208059374);	row1.push(0.665026026);	row1.push(0.675026026);	row1.push(0.0217059374);
row2.push(2.7026183557051);	row2.push(0.0295087478);	row2.push(0.81078550671153);	row2.push(0.81278550671153);	row2.push(0.0315087478);
row3.push(2.8026183557051);	row3.push(0.049496247714569);	row3.push(0.84078550671153);	row3.push(0.85078550671153);	row3.push(0.049096247714569);
row4.push(2.9026183557051);	row4.push(2.9026183557051);	row4.push(0.94078550671153);	row4.push(0.95078550671153);	row4.push(0.149096247714569);
row5.push(1.05078550671153);	row5.push(0.249496247714569);	row5.push(1.04078550671153);	row5.push(1.05078550671153);	row5.push(0.249096247714569);
row6.push(3.1026183557051);	row6.push(0.349496247714569);	row6.push(1.14078550671153);	row6.push(1.15078550671153);	row6.push(0.349096247714569);
row7.push(3.2026183557051);	row7.push(0.449496247714569);	row7.push(1.24078550671153);	row7.push(1.25078550671153);	row7.push(0.449096247714569);
row8.push(3.3026183557051);	row8.push(0.549496247714569);	row8.push(1.34078550671153);	row8.push(1.35078550671153);	row8.push(0.549096247714569);
row9.push(3.3026183557051);	row9.push(0.549496247714569);	row9.push(1.34078550671153);	row9.push(1.35078550671153);	row9.push(0.549096247714569);
row10.push(3.5026183557051);	row10.push(3.015675776);	row10.push(1.54078550671153);	row10.push(1.55078550671153);	row10.push(1.54078550671153);
 
row1.push(0);
//row2.push(0);
row3.push(0);
row4.push(1);
row5.push(1);
row6.push(1);
row7.push(1);
row8.push(1);
row9.push(1);
row10.push(1);

trainingData.push(row1);
 //trainingData.push(row2);
 trainingData.push(row3);
 trainingData.push(row4);
 trainingData.push(row5);
 trainingData.push(row6);
 trainingData.push(row7);
 trainingData.push(row8);
 trainingData.push(row9);
 trainingData.push(row10);

testingData.push(row2);
// === Train the logistic regression === //
var model = logistic.fit(trainingData);

// === Print the trained model === //
console.log(model.config);
console.log(model.cost);
console.log(model.theta);

var probabilityOfSpeciesBeingIrisVirginica = logistic.transform(testingData[0]);
var predicted = logistic.transform(testingData[0]) >= 0.5 ? 1 : 0;

console.log("actual probability" + probabilityOfSpeciesBeingIrisVirginica);
console.log("logistic.threshold"+logistic.threshold);
console.log(" predicted: " + predicted);

