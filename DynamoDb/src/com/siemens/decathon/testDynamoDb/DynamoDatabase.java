package com.siemens.decathon.testDynamoDb;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.internal.StaticCredentialsProvider;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.model.AttributeDefinition;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.CreateTableRequest;
import com.amazonaws.services.dynamodbv2.model.CreateTableResult;
import com.amazonaws.services.dynamodbv2.model.KeySchemaElement;
import com.amazonaws.services.dynamodbv2.model.KeyType;
import com.amazonaws.services.dynamodbv2.model.ProvisionedThroughput;
import com.amazonaws.services.dynamodbv2.model.PutItemRequest;
import com.amazonaws.services.dynamodbv2.model.PutItemResult;
import com.amazonaws.services.dynamodbv2.model.ScalarAttributeType;
import com.prosysopc.ua.client.MonitoredDataItem;

public class DynamoDatabase {

	AWSCredentials credentials;
	AmazonDynamoDB client;
	DynamoDB dynamoDB;
	public DynamoDatabase()
	{
	 credentials = new BasicAWSCredentials("TestAccessKey", "TestSecretKey");
	 client = AmazonDynamoDBClientBuilder.standard().withEndpointConfiguration(
					new AwsClientBuilder.EndpointConfiguration("http://localhost:8000", Regions.AP_SOUTH_1.name()))
			.withCredentials(new StaticCredentialsProvider(credentials)).build();
	 dynamoDB = new DynamoDB(client);
	 createTable();
	}
	
	public void createTable()
	{
	  Table tableName = dynamoDB.getTable("SignalTableNew");
	  if(tableName == null)
	  {
		System.out.println("Creating new table");
		List<AttributeDefinition> attributeDefinitions = new ArrayList<>();
		attributeDefinitions.add(new AttributeDefinition().withAttributeName("SignalName")
				.withAttributeType(ScalarAttributeType.S));
		attributeDefinitions.add(new AttributeDefinition().withAttributeName("SignalValue")
				.withAttributeType(ScalarAttributeType.S));
     
		CreateTableRequest createTableRequest = new CreateTableRequest().withTableName("SignalTableNew")
	             .withKeySchema(new KeySchemaElement("SignalName", KeyType.HASH))
	             .withKeySchema(new KeySchemaElement("SignalValue", KeyType.RANGE))
	             .withProvisionedThroughput(new ProvisionedThroughput(new Long(10), new Long(10)))
	             .withAttributeDefinitions(attributeDefinitions);;
		try {
			CreateTableResult result = client.createTable(createTableRequest);
			System.out.println(result.getTableDescription().getTableName());
		} catch (AmazonServiceException e) {
			System.err.println(e.getErrorMessage());
			System.exit(1);
		}
	  }
	  else
	  {
		  System.out.println("Table aready exists " + tableName.getTableName());
	  }
	}

	public void updateTable(MonitoredDataItem node) {
		Map<String,AttributeValue> attributeValues = new HashMap<>();
        attributeValues.put("SignalName",new AttributeValue().withS(node.getNodeId().toString()));
        attributeValues.put("SignalValue",new AttributeValue().withS(node.getValue().toString()));
        PutItemRequest putItemRequest = new PutItemRequest().withTableName("SignalTableNew")
                .withItem(attributeValues);
        PutItemResult putItemResult = client.putItem(putItemRequest);
	}
}
