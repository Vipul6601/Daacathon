 
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
getData();
var fluidFlowData=[];
var PumpEffData =[];	
var TDHData =[];
var PredictPumpEffData = [];
var PredictTDHData=[];	
var myChart2;
var myChart1;
var counter =0;
var firstTimeCall = true;
var scanExecute = function() {
    
    var inter = setInterval(function() {
        fluidFlowData=[];
        PumpEffData=[];
		TDHData=[];
		PredictPumpEffData=[];
		PredictTDHData=[];
        getData();
    }, 1000); 
} 

function getRandomInt(max) {
	  return Math.floor(Math.random() * Math.floor(max));
	}
function getData(){
	var params = {
			TableName : "MeasuredData"
		};	

	  docClient.scan(params,function(err, data){
       if(err) {
		   	console.log("error");
       } else {
		console.log("records" + data);
		data.Items.sort(function(a, b){
		    return a.Id-b.Id;
		});
		if(firstTimeCall)
		{		
			for(var index=0; index<data.Items.length ;index++)
			{
            	fluidFlowData.push(data.Items[index].FluidFlow);
           	 	PumpEffData.push(data.Items[index].PumpEffeciency);
				TDHData.push(data.Items[index].DynamicHead);
				PredictPumpEffData.push(data.Items[index].PredictedPumpEffeciency);
				PredictTDHData.push(data.Items[index].PredictedDynamicHead);
			}
			firstTimeCall = false;
		}
		else{
			myChart2.data.datasets[0].data.push(parseInt(data.Items[data.Items.length-1].PumpEffeciency));//update eff actual
			myChart2.data.datasets[1].data.push(parseInt(data.Items[data.Items.length-1].PredictedPumpEffeciency));//update eff refernce
			myChart1.data.datasets[0].data.push(parseInt(data.Items[data.Items.length-1].DynamicHead));//update tdh actual
			myChart1.data.datasets[1].data.push(parseInt(data.Items[data.Items.length-1].PredictedDynamicHead));//update tdh refernce
			myChart2.data.labels.push(data.Items[data.Items.length-1].FluidFlow);////update flow
			myChart2.update({duration:0});
			myChart1.update({duration:0});
			if(counter > 5)
			{
				myChart2.data.labels.splice(0,1);
				myChart2.data.datasets[0].data.splice(0,1);
				myChart2.data.datasets[1].data.splice(0,1);
				myChart1.data.datasets[0].data.splice(0,1);
				myChart1.data.datasets[1].data.splice(0,1);
				myChart2.update({duration:0});
				myChart1.update({duration:0});
			}
			else
				{
				counter++;
				}
			
            myChart1.update();
			}
		}
        		
	 });
}

scanExecute();

function plotAmpFreqGraph()
{

	var flowAct = fluidFlowData;//[1,1.5,3.0,4.5];//;fluidFlowData ;
	var effAct = PumpEffData;//[2.52,2.71,2.86,2.99];//PumpEffData;
	var tdhAct = TDHData;//[40.75,  40.4, 39.64, 38.74];//TDHData;
	
	var effRef = PredictPumpEffData;//[2.06, 2.13, 2.26, 2.58];//, 2.52,2.71,2.86,2.99];
	var tdhRef = PredictTDHData;//[40.55,  40.63,40.65,  40.82];//,40.75,  40.4, 39.64, 38.74];
	
	myChart1 = new Chart(document.getElementById("myChart1"), {
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
			scales: {
				yAxes: [{
				  scaleLabel: {
					display: true,
					labelString: 'TDH'
				  }
				}]}
            
        }
  	});
    
     myChart2 = new Chart(document.getElementById("myChart2"), {
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
			  scales: {
				yAxes: [{
				  scaleLabel: {
					display: true,
					labelString: 'Efficiency'
				  }
				}]}
          }
    	});
      
}
