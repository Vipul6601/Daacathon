
var app = angular.module('reportsApp',[]);

app.factory('Excel',function($window){
    var uri='data:application/vnd.ms-excel;base64,',
        template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
        format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};
    return {
        tableToExcel:function(tableId,worksheetName){
            var table=$(tableId),
                ctx={worksheet:worksheetName,table:table.html()},
                href=uri+base64(format(template,ctx));
            return href;
        }
    };
})
 app.controller('reportsController', function($scope,Excel,$timeout) {
        var kpiHeaders = ["S. No.", "Pump Effeciency", "Dynamic Head", "Motor Status"];
		var alarmHeaders = ["S. No.", "Category", "Name", "Status","Type"];
        var tableData = [];
    
        var awsConfig = {
            "region" : region,
            "accessKeyId" : accessKeyId,
            "secretAccessKey" : secretAccessKey	
        };
        var startDate= new Date((new Date()).getTime() - (15 * 86400000));
        var endDate =new Date();

 

        AWS.config.update(awsConfig);
        var docClient = new AWS.DynamoDB.DocumentClient();
      	 	
		$scope.generateReport = function(){
		 $scope.reportData = {
			startdate : $scope.startDate,
			enddate : $scope.endDate,
			report : $scope.report,
			};
			debugger;
			if ($scope.reportData.report == "kpi")
			{
				$scope.IsVisible = true;
				$scope.IsVisibleSecond = false;
				fetchReportData($scope,"MeasuredData");
			}
			else if ($scope.reportData.report == "alarm" )
			{
				$scope.IsVisible = false;
				$scope.IsVisibleSecond = true;
				fetchReportData($scope,"AlarmTable");
			}
			
		}
		
		function fetchReportData($scope,tableName){
		var params = {
            TableName : tableName
        };	
        docClient.scan(params,function(err, data){
        if(err)
        {
        console.log("error");
        }
        else 
        {
        console.log("success");
        tableData = [];
		
        for(var index=0; index<data.Items.length ;index++){
			debugger;  
           var rowData = [];			
            var date=new Date(parseInt(data.Items[index].Id))            
            
     if($scope.reportData.startdate<=date && date<=$scope.reportData.enddate){
            rowData.push(index+1);
		if (tableName == "MeasuredData")
		{			
            var pumpEff = String(data.Items[index].PumpEffeciency);
            pumpEff =  pumpEff.substring(0,5);
            rowData.push(pumpEff);
            
            var dyHEad = String(data.Items[index].DynamicHead);
            dyHEad =  dyHEad.substring(0,5);
            rowData.push(dyHEad);

            rowData.push(data.Items[index].MotorStatus); 
        }		 
		else 
        {
		    rowData.push(data.Items[index].Category);            
            rowData.push(data.Items[index].Name);
            rowData.push(data.Items[index].AlarmStatus); 
			rowData.push(data.Items[index].Type); 

		  }
        }
        tableData.push(rowData);           
        
        }		

        $scope.kpiHeaders=kpiHeaders;
		$scope.alarmHeaders=alarmHeaders;
        $scope.tableData=tableData;	
        $scope.$apply();
        }		
        
		});
	}
    


    $scope.exportToExcel=function(tableId){ // ex: '#my-table'
    var exportHref=Excel.tableToExcel(tableId,'Report Fetched');
    $timeout(function(){location.href=exportHref;},100); // trigger download
    }
});


