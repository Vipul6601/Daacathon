 
var awsConfig = {

    "region" : region,
    // // "endpoint" :endpoint,
     "accessKeyId" : accessKeyId,
     "secretAccessKey" : secretAccessKey	

	// "region" : "us-west-2",
	// "accessKeyId" : "AKIAJAC4FNRBNLX7ZGGA",
	// "secretAccessKey" : "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"	
};			   
AWS.config.update(awsConfig);
var docClient = new AWS.DynamoDB.DocumentClient();
//var data = null;

var scanExecute = function() {
	var params = {
			TableName : "MeasuredData"
		};	
		console.log("read f");
		//debugger;
		
		
	  docClient.scan(params,function(err, data){
       if(err) {
		   	console.log("error");
       } else {
		console.log("records" + data);		
        var xAxisData=[];
        var yAxisData =[];		
		
		for(var index=0; index<data.Items.length ;index++){
            xAxisData.push(data.Items[index].FluidFlow);
            yAxisData.push(data.Items[index].PumpEffeciency);
		}
					
 var data = [ { label: "Flow vs Efficiency", 
               x: xAxisData, 
               y: yAxisData}];
              //{ label: "Data Set 2", 
               // x: [0, 1, 2, 3, 4], 
               // y: [0, 1, 4, 9, 16]
			   //} ] ;
			   


		var xy_chart = d3_xy_chart()
	    // .width(960)
	    // .height(500)
	    .xlabel("Flow")
	    .ylabel("Pump Efficiency") ;
		
		var svg = d3.select("#graph").append("svg")
	    .datum(data)
	    .call(xy_chart) ;
		
		 }
	 });
};
scanExecute();
	
function plotAmpFreqGraph()
{
	var flowAct = [0, 1, 3, 4, 6, 7, 9, 10];
	var effAct = [2.16, 3.13, 4.26, 2.58, 2.72,2.91,2.96,2.99];
	var tdhAct = [45.55,  43.63,41.65,  40.82,45.75,  41.4, 39.84, 39.04];
	
	var effRef = [2.06, 2.13, 2.26, 2.58, 2.52,2.71,2.86,2.99];
	var tdhRef = [40.55,  40.63,40.65,  40.82,40.75,  40.4, 39.64, 38.74];
	
	var myChart1 = new Chart(document.getElementById("myChart1"), {
  	  type: 'line',
  	  data: {
  	    labels: flowAct,
  	    datasets: [{ 
  	        data: tdhAct,
  	        label: "Actual",
  	        borderColor: "red",
  	        fill: false
  	      }, { 
  	        data: tdhRef,
  	        label: "Reference",
  	        borderColor: "purple",
  	        fill: false
  	      }
  	    ]
  	  },
  	  options: {
            title: {
                display: true,
                text: "TDH vs FLOW"
            },
            tooltips: {
                mode: 'label'
            },
            responsive: true,
            
        }
  	});
    
    var myChart2 = new Chart(document.getElementById("myChart2"), {
    	  type: 'line',
    	  data: {
    	    labels: flowAct,
    	    datasets: [{ 
    	        data: effAct,
    	        label: "Actual",
    	        borderColor: "#3e95cd",
    	        fill: false
    	      }, { 
    	        data: effRef,
    	        label: "Reference",
    	        borderColor: "#8e5ea2",
    	        fill: false
    	      }
    	    ]
    	  },
    	  options: {
              title: {
                  display: true,
                  text: "EFFICIENCY vs FLOW"
              },
              tooltips: {
                  mode: 'label'
              },
              responsive: true,
              
          }
    	});
      
}
