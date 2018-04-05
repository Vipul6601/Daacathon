
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as AWS from 'aws-sdk';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent implements OnInit {
  
  power : string;
  speed: string;
  flow: string;
  density: string;
  threshold: string;
  characterstics:string;
  dbValues: string[];
  constructor() { 
    this.dbValues=[];
    this.method();
  }

  ngOnInit() {
  }


    
	 awsConfig = {
    "region" : "us-west-2",
    //"endpoint" : "http://localhost:8000",
    "accessKeyId" : "AKIAJAC4FNRBNLX7ZGGA",
    "secretAccessKey" : "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"	
  };
    
  method(){
    AWS.config.update(this.awsConfig);
    var docClient = new AWS.DynamoDB.DocumentClient();
    var params = {
          TableName : "ParamaterizedData"
          //TableName : "DummyTable"
        };	
    docClient.scan(params,function(err, data){
    if(err)
    {
     console.log("error");
    }
    else 
    {
     console.log("success");
     for(var record in data)
     {
      
      //alert(JSON.stringify(data[record], undefined, 2)); 							
      for(var item in data[record])
      {
       for(var header in data[record][item])
        {	
          var value = data[record][item][header];
          console.log(value);
         // this.dbValues.push(value);
        }
      }					
     }
     
    
	this.power=this.dbValues[0];
	this.speed=this.dbValues[1];
	this.flow=this.dbValues[2];
	this.density=this.dbValues[4];
	this.characterstics=this.dbValues[5];
  this.threshold=this.dbValues[7];
  this.power=10;
    }});
  }
  onSubmitTemplateBased(){
   
		 
     var tableData = {
       power : this.power,
       speed :this.speed,
       flow : this.flow,
       density : this.density,
       characterstics : this.characterstics,
       threshold : this.threshold
       };
     
       console.log('table data', this.power);
     var params = {
     TableName: "ParamaterizedData",
     Key: {
       
       "Id": "10"
     },
     UpdateExpression: "set RatedPower = :power, RatedEfficiency = :ratedEfficiency , RatedSpeed = :ratedSpeed ,RatedFlow = :ratedFlow",
     ExpressionAttributeValues: {
       ":ratedPower":  this.power,
       ":ratedEfficiency": this.threshold,
       ":ratedSpeed": this.speed ,
       ":ratedFlow": this.flow
 
     },
     ReturnValues: "UPDATED_NEW"
   };
   /*var ddb = new AWS.DynamoDB() ;
     ddb.updateItem(params, function(err, data) {
       if (err) { return console.log(err); }
       console.log("We updated the table with this: " + JSON.stringify(data));
     });*/
     console.log("Updating the item...");
     var docClient = new AWS.DynamoDB.DocumentClient();
     docClient.update(params, function (err, data) {
     if (err) {
       console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
     } else {
       console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
     }
   });
 
  }

  }
  
