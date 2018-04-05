import {Injectable} from '@angular/core'
import * as AWS from 'aws-sdk';

@Injectable()
export class ConfigurationService{
    constructor(){
        console.log('PostServic Initialized'); 
    }
    awsConfig = {
        "region" : "us-west-2",
        //"endpoint" : "http://localhost:8000",
        "accessKeyId" : "AKIAJAC4FNRBNLX7ZGGA",
        "secretAccessKey" : "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"	
    };
    getPosts(){
        AWS.config.update(this.awsConfig);
    var docClient = new AWS.DynamoDB.DocumentClient();
		var params = {
			TableName : "DummyTable"
		};	
	docClient.scan(params,function(err, data){
    });
        
 
    }
}