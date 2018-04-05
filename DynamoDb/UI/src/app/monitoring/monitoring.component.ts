import { Component, OnInit } from '@angular/core';
import * as AWS from 'aws-sdk';
@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.css']
})
export class MonitoringComponent implements OnInit {

  constructor() {
		this.readItemMethod();
	 }

  ngOnInit() {
  }
 

 awsConfig = {
	"region" : "us-west-2",
	//"endpoint" : "http://localhost:8000",
	"accessKeyId" : "AKIAJAC4FNRBNLX7ZGGA",
	"secretAccessKey" : "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"	
};

//var readItem = function(){
	readItemMethod() 
	{
    AWS.config.update(this.awsConfig);
    var docClient = new AWS.DynamoDB.DocumentClient();
		var params = {
			TableName : "DummyTable"
		};	
	docClient.scan(params,function(err, data){
		if(err)
		{
		  document.getElementById('textarea').innerHTML ="false";
		  document.getElementById('textarea').innerHTML = "Unable to read item: " + "\n" + JSON.stringify(err, undefined, 2);
		}
		else 
		{
		 
		// this.showDataItems(data);		 
    var table = document.createElement("table");
    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
   // var tr = table.insertRow(-1);                   // TABLE ROW.
var headerAdded = true;
var col = [];
var index=0;
for(var record in data)
{
  var tr = table.insertRow(-1);	
  //alert(JSON.stringify(data[record], undefined, 2)); 							
  for(var item in data[record])
  {
    tr = table.insertRow(-1);
    for(var header in data[record][item])
    {	
      if(headerAdded)
      {
       col.push(header);
      }						
      var value = data[record][item][header];
      var tabCell = tr.insertCell(-1);
      tabCell.innerHTML = value;							
		}	
		if(index%2!==0){
			tr.style.backgroundColor="#D4D9D8";
		}
		index++
    headerAdded = false;	
    tr = table.insertRow(-1);				
  }					
}
// TABLE HEADER.
  tr = table.insertRow(1);	
    for (var i = 0; i < col.length; i++) {
    var th = document.createElement("th");      
    th.innerHTML = col[i];
		tr.appendChild(th);
		table.style.width="100%"
		tr.style.backgroundColor="#1EE8AB";
		tr.style.textAlign='left'
    }

    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById("showData");
divContainer.innerHTML = "";
    divContainer.appendChild(table);
		}		
	 });	 
	}
  



}
