var setBuilder = {

    buildSet: function (tableData) {

        var sets = [];
        var set = [];
        for (var index = 0; index < tableData.length; index++) {
            var rowData = tableData[index];
            set.push(rowData);
            if((index+1)%64 == 0)
            {
                sets.push(set);
                set = [];
            }else if(index == tableData.length-1 && set.length>0)
            {
                sets.push(set);
            }
        }
        console.log("Set builder Number of sets are"+sets.length);

        return sets;
    }

};
console.log('[@setBuilder] setBuilder = ', setBuilder);
module.exports = setBuilder;