var frequencyAnalyser = {

    generateAnalysedSets: function (sets) {
        var set = [];
        var defectFrequencySet = [];
        var filteredSets = [];
        var frequencyErrorMargin = 5;

        for (var setIndex = 0; setIndex < sets.length; setIndex++) {
            var filteredSet = {};
            var amplitudeSum = 0;
            for (var recordIndex = 0; recordIndex < sets[setIndex].length; recordIndex++) {
                var record = sets[setIndex][recordIndex];
                filteredSet.Fault=record.Fault;
               
                amplitudeSum = amplitudeSum + parseFloat(record.Amplitude);

                if (parseFloat(record.Frequency) + frequencyErrorMargin > 150 && parseFloat(record.Frequency) - frequencyErrorMargin < 150) {

                    if (typeof (filteredSet.DefectFrequency1) === "undefined")
                        filteredSet.DefectFrequency1 = record;
                    else {
                        filteredSet.DefectFrequency1 = calculateOptimizedRecord(filteredSet.DefectFrequency1, record, 150);
                    }

                }
                else if (parseFloat(record.Frequency) + frequencyErrorMargin > 300 && parseFloat(record.Frequency) - frequencyErrorMargin < 300) {
                    if (typeof (filteredSet.DefectFrequency2) === "undefined")
                        filteredSet.DefectFrequency2 = record;
                    else {
                        filteredSet.DefectFrequency2 = calculateOptimizedRecord(filteredSet.DefectFrequency2, record, 300);
                    }
                }
                else if (parseFloat(record.Frequency) + frequencyErrorMargin > 100 &&
                    parseFloat(record.Frequency) - frequencyErrorMargin < 100 ) {
                    if (typeof (filteredSet.DefectFrequency3) === "undefined")
                        filteredSet.DefectFrequency3 = record;
                    else {
                        filteredSet.DefectFrequency3 = calculateOptimizedRecord(filteredSet.DefectFrequency3, record, 100);
                    }
                }
                else if (parseFloat(record.Frequency) + frequencyErrorMargin > 200
                    && parseFloat(record.Frequency) - frequencyErrorMargin < 200) {
                    if (typeof (filteredSet.DefectFrequency4) === "undefined")
                        filteredSet.DefectFrequency4 = record;
                    else {
                        filteredSet.DefectFrequency4 = calculateOptimizedRecord(filteredSet.DefectFrequency4, record, 200);
                    }
                }
                else if (parseFloat(record.Frequency) + frequencyErrorMargin > 250 &&
                    parseFloat(record.Frequency) - frequencyErrorMargin < 250) {
                    if (typeof (filteredSet.DefectFrequency5) === "undefined")
                        filteredSet.DefectFrequency5 = record;
                    else {
                        filteredSet.DefectFrequency5 = calculateOptimizedRecord(filteredSet.DefectFrequency5, record, 250);
                    }
                }
                else if (parseFloat(record.Frequency) + frequencyErrorMargin > 350 &&
                    parseFloat(record.Frequency) - frequencyErrorMargin < 350) {
                    if (typeof (filteredSet.DefectFrequency6) === "undefined")
                        filteredSet.DefectFrequency6 = record;
                    else {
                        filteredSet.DefectFrequency6 = calculateOptimizedRecord(filteredSet.DefectFrequency6, record, 350);
                    }
                }
                else if (parseFloat(record.Frequency) + frequencyErrorMargin > 50 && parseFloat(record.Frequency) - frequencyErrorMargin < 50) {
                    if (typeof (filteredSet.DefectFrequency7) === "undefined")
                        filteredSet.DefectFrequency7 = record;
                    else {
                        filteredSet.DefectFrequency7 = calculateOptimizedRecord(filteredSet.DefectFrequency7, record, 50);
                    }
                }

            }
            filteredSet.AverageAmplitude = amplitudeSum / sets[setIndex].length;
            filteredSet.impellarCombination = checkImpellarCombination(filteredSet);
            filteredSets.push(filteredSet);
        }
        console.log("Frequency Filetered Number of sets are" + filteredSets.length);
        return filteredSets;
    }

};

function calculateOptimizedRecord(currentRecord, newRecord, baseFrequency) {
    var currentDiff = 0;
    var newDiff = 0;
    if (parseFloat(currentRecord.Frequency) > baseFrequency)
        currentDiff = parseFloat(currentRecord.Frequency) - baseFrequency;
    else
        currentDiff = baseFrequency - parseFloat(currentRecord.Frequency);

    if (parseFloat(newRecord.Frequency) > baseFrequency)
        newDiff = parseFloat(newRecord.Frequency) - baseFrequency;
    else
        newDiff = baseFrequency - parseFloat(newRecord.Frequency);

    if (newDiff < currentDiff)
        return newRecord;
    else
        return currentRecord;
}
function checkImpellarCombination(filteredSet) {

    var impellarCombination = 0;
    if (typeof (filteredSet.DefectFrequency1) !== "undefined" &&
        typeof (filteredSet.DefectFrequency2) !== "undefined" &&
        typeof (filteredSet.DefectFrequency5) !== "undefined" &&
        typeof (filteredSet.DefectFrequency6) !== "undefined" &&
        typeof (filteredSet.DefectFrequency7) !== "undefined" &&
        typeof (filteredSet.DefectFrequency3) === "undefined" &&
        typeof (filteredSet.DefectFrequency4) === "undefined") {
            if (parseFloat(filteredSet.DefectFrequency3.Amplitude < 0)
            && parseFloat(filteredSet.DefectFrequency4.Amplitude < 0))
               impellarCombination = 2;
    }
    if (typeof (filteredSet.DefectFrequency1) !== "undefined" &&
        typeof (filteredSet.DefectFrequency2) !== "undefined" &&
        typeof (filteredSet.DefectFrequency3) !== "undefined" &&
        typeof (filteredSet.DefectFrequency4) !== "undefined" &&
        typeof (filteredSet.DefectFrequency7) !== "undefined" &&
        typeof (filteredSet.DefectFrequency5) === "undefined" &&
        typeof (filteredSet.DefectFrequency6) === "undefined") {
        if (parseFloat(filteredSet.DefectFrequency5.Amplitude < 0)
        && parseFloat(filteredSet.DefectFrequency6.Amplitude < 0))
            impellarCombination = 1;
    }
    if (typeof (filteredSet.DefectFrequency1) !== "undefined" &&
    typeof (filteredSet.DefectFrequency2) !== "undefined" &&
    typeof (filteredSet.DefectFrequency3) !== "undefined" &&
    typeof (filteredSet.DefectFrequency4) !== "undefined" &&
    typeof (filteredSet.DefectFrequency5) !== "undefined" &&
    typeof (filteredSet.DefectFrequency6) !== "undefined" &&
    typeof (filteredSet.DefectFrequency7) !== "undefined") {
        impellarCombination = 3;

//   console.log(parseFloat(filteredSet.DefectFrequency5.Amplitude) + "ccc"+parseFloat(filteredSet.DefectFrequency6.Amplitude))
//     if (parseFloat(filteredSet.DefectFrequency3.Amplitude) > 0
//         && parseFloat(filteredSet.DefectFrequency4.Amplitude) > 0  
//         && parseFloat(filteredSet.DefectFrequency5.Amplitude) > 0
//         && parseFloat(filteredSet.DefectFrequency6.Amplitude) > 0)
//     else if (parseFloat(filteredSet.DefectFrequency3.Amplitude) < 0
//         || parseFloat(filteredSet.DefectFrequency4.Amplitude) < 0)
//         impellarCombination = 2;
//     else if (parseFloat(filteredSet.DefectFrequency5.Amplitude) < 0
//         || parseFloat(filteredSet.DefectFrequency6.Amplitude) < 0)
//         impellarCombination = 1;

    }
    return impellarCombination;
}

console.log('[@frequencyAnalyser] frequencyAnalyser = ', frequencyAnalyser);
module.exports = frequencyAnalyser;