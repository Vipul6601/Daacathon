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
import com.amazonaws.services.dynamodbv2.model.AttributeDefinition;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.services.dynamodbv2.model.CreateTableRequest;
import com.amazonaws.services.dynamodbv2.model.KeySchemaElement;
import com.amazonaws.services.dynamodbv2.model.KeyType;
import com.amazonaws.services.dynamodbv2.model.ProvisionedThroughput;
import com.amazonaws.services.dynamodbv2.model.PutItemRequest;
import com.amazonaws.services.dynamodbv2.model.PutItemResult;
import com.amazonaws.services.dynamodbv2.model.ScalarAttributeType;
import com.amazonaws.services.dynamodbv2.model.StreamSpecification;
import com.amazonaws.services.dynamodbv2.model.StreamViewType;
import com.amazonaws.services.dynamodbv2.util.TableUtils;
import com.prosysopc.ua.client.MonitoredDataItem;
import com.siemens.decathon.Constants.OpcUAClientConstants;;

public class DynamoDatabase {

	AWSCredentials credentials;
	AmazonDynamoDB client;
	DynamoDB dynamoDB;
	public DynamoDatabase()
	{
	 credentials = new BasicAWSCredentials(OpcUAClientConstants.ACCESS_KEY, OpcUAClientConstants.SECRET_KEY);
	 client = AmazonDynamoDBClientBuilder.standard().withEndpointConfiguration(
					new AwsClientBuilder.EndpointConfiguration(OpcUAClientConstants.URL, Regions.AP_SOUTH_1.name()))
			.withCredentials(new StaticCredentialsProvider(credentials)).build();
	 dynamoDB = new DynamoDB(client);
	 createTable();
	}
	
	public void createTable()
	{
		List<AttributeDefinition> attributeDefinitions = new ArrayList<>();
		attributeDefinitions.add(new AttributeDefinition().withAttributeName(OpcUAClientConstants.ATTRIBUTE_COL_1)
				.withAttributeType(ScalarAttributeType.S));
		attributeDefinitions.add(new AttributeDefinition().withAttributeName(OpcUAClientConstants.ATTRIBUTE_COL_2)
				.withAttributeType(ScalarAttributeType.S));
     
		 StreamSpecification streamSpecification = new StreamSpecification()
		            .withStreamEnabled(true)
		            .withStreamViewType(StreamViewType.NEW_IMAGE);
		 
		CreateTableRequest createTableRequest = new CreateTableRequest().withTableName(OpcUAClientConstants.TABLE_NAME)
	             .withKeySchema(new KeySchemaElement(OpcUAClientConstants.ATTRIBUTE_COL_1, KeyType.HASH))
	             .withKeySchema(new KeySchemaElement(OpcUAClientConstants.ATTRIBUTE_COL_2, KeyType.RANGE))
	             .withProvisionedThroughput(new ProvisionedThroughput(new Long(10), new Long(10)))
	             .withAttributeDefinitions(attributeDefinitions).withStreamSpecification(streamSpecification);
		
		try {
		//	CreateTableResult result = client.createTable(createTableRequest);
			TableUtils.createTableIfNotExists(client,createTableRequest);
		} catch (AmazonServiceException e) {
			System.err.println(e.getErrorMessage());
			System.exit(1);
		}
	}

	public void updateTable(MonitoredDataItem node) {
		Map<String,AttributeValue> attributeValues = new HashMap<>();
        attributeValues.put(OpcUAClientConstants.ATTRIBUTE_COL_1,new AttributeValue().withS(node.getNodeId().toString()));
        attributeValues.put(OpcUAClientConstants.ATTRIBUTE_COL_2,new AttributeValue().withS(node.getValue().toString()));
        PutItemRequest putItemRequest = new PutItemRequest().withTableName(OpcUAClientConstants.TABLE_NAME)
                .withItem(attributeValues);
        PutItemResult putItemResult = client.putItem(putItemRequest);
	}
}
