var AWS = require("aws-sdk");
var regression = require("regression");
var region = "ap-south-1";
var accessKeyId = "AKIAIBWKTCLH6XLWRBXQ";
var secretAccessKey = "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";
var flow = 60;// To be removed
var id = "1523369328852"; // To be removed
getListFlowEff(flow);// To be removed

function getListFlowEff(flow, id)
{
    var testDataArr = [];
    var awsConfig = 
    {
        "region" : region,
        // "endpoint" :endpoint,
        "accessKeyId" : accessKeyId,
        "secretAccessKey" : secretAccessKey	
    };
    AWS.config.update(awsConfig);
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params =
    {
        TableName : "TestData"
    };	

    docClient.scan(params,function(err, data)
    {
        if(err)
        {
            console.log("error");
        }
        else 
        {
			console.log("success12");
            for(var index=0; index<data.Items.length ;index++)
            {
                var rowData = [];
                rowData.push(parseInt(data.Items[index].FluidFlow));
                rowData.push(parseInt(data.Items[index].Efficiency));
				testDataArr.push(rowData);
            }
			const result = regression.linear(testDataArr);
			const gradient = result.equation[0];
			const yIntercept = result.equation[1];
			var refEff = result.predict(parseInt(flow))[1];
			console.log(result.predict(parseInt(flow))[1]);
			
			var params = {
			TableName: "MeasuredData",
			Key: {
				
				"Id": id
			},
			UpdateExpression: "set MotorRpm = "+refEff,//Replace with once working : "set RefEfficiency = "
			ReturnValues: "UPDATED_NEW"
			}
			docClient.scan(params,function(err, data)
			{
				if(err)
				{
					console.log("error"+err);
				}
				else 
				{
					 console.log("updated data"+JSON.stringify(data));
				}
			})	
		}			
    })
    
    
}

function getListFlowTDH(flow, id)
{
    var testDataArr = [];
    var awsConfig = 
    {
        "region" : region,
        // "endpoint" :endpoint,
        "accessKeyId" : accessKeyId,
        "secretAccessKey" : secretAccessKey	
    };
    AWS.config.update(awsConfig);
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params =
    {
        TableName : "TestData"
    };	

    docClient.scan(params,function(err, data)
    {
        if(err)
        {
            console.log("error");
        }
        else 
        {
            
            for(var index=0; index<data.Items.length ;index++)
            {
                var rowData = [];
                rowData.push(parseInt(data.Items[index].FluidFlow));
                rowData.push(parseInt(data.Items[index].TDH));
                testDataArr.push(rowData);
				
				const result = regression.linear(testDataArr);
				const gradient = result.equation[0];
				const yIntercept = result.equation[1];
				console.log(result.predict(parseInt(flow))[1]);
				return result.predict(parseInt(flow))[1];
            }
        }		
    })
}