package com.siemens.decathon.testDynamoDb;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
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
import com.siemens.decathon.Constants.OpcUAClientConstants;

;

public class DynamoDatabase {

	AWSCredentials credentials;
	AmazonDynamoDB client;
	DynamoDB dynamoDB;

	public static void main(String[] args) {
		new DynamoDatabase();
	}

	public DynamoDatabase() {
		credentials = new BasicAWSCredentials(OpcUAClientConstants.ACCESS_KEY,
				OpcUAClientConstants.SECRET_KEY);
		client = AmazonDynamoDBClientBuilder.standard()
				.withRegion(Regions.AP_SOUTH_1)/*
												 * withEndpointConfiguration(
												 * new AwsClientBuilder.
												 * EndpointConfiguration
												 * (OpcUAClientConstants.URL,
												 * Regions.AP_SOUTH_1.name()))
												 */
				.withCredentials(new StaticCredentialsProvider(credentials))
				.build();
		dynamoDB = new DynamoDB(client);
		createTable();
		updateParameterizedTable();

	}

	public void createTable() {

		StreamSpecification streamSpecification = new StreamSpecification()
				.withStreamEnabled(true).withStreamViewType(
						StreamViewType.NEW_IMAGE);

		List<AttributeDefinition> paramAttributeDefinitions = new ArrayList<>();
		paramAttributeDefinitions.add(new AttributeDefinition()
				.withAttributeName(
						OpcUAClientConstants.PARAMETERIZED_DATA_COL_1)
				.withAttributeType(ScalarAttributeType.S));

		List<AttributeDefinition> measuredAttributeDefinitions = new ArrayList<>();
		measuredAttributeDefinitions.add(new AttributeDefinition()
				.withAttributeName(OpcUAClientConstants.MEASURED_DATA_COL_1)
				.withAttributeType(ScalarAttributeType.S));
		measuredAttributeDefinitions.add(new AttributeDefinition()
		.withAttributeName("SortKey").withAttributeType(
				ScalarAttributeType.N));

		List<AttributeDefinition> testDataAttributeDefinitions = new ArrayList<>();
		testDataAttributeDefinitions.add(new AttributeDefinition()
				.withAttributeName(OpcUAClientConstants.TEST_DATA_COL_1)
				.withAttributeType(ScalarAttributeType.S));

		CreateTableRequest createParamTableRequest = new CreateTableRequest()
				.withTableName(OpcUAClientConstants.PARAMETERIZED_DATA_TABLE)
				.withKeySchema(
						new KeySchemaElement(
								OpcUAClientConstants.PARAMETERIZED_DATA_COL_1,
								KeyType.HASH))
				.withProvisionedThroughput(
						new ProvisionedThroughput(new Long(10), new Long(10)))
				.withAttributeDefinitions(paramAttributeDefinitions)
				.withStreamSpecification(streamSpecification);

		CreateTableRequest createMeasuredTableRequest = new CreateTableRequest()
				.withTableName(OpcUAClientConstants.MEASURED_DATA_TABLE)
				.withKeySchema(
						new KeySchemaElement(
								OpcUAClientConstants.MEASURED_DATA_COL_1,
								KeyType.HASH))
				.withKeySchema(new KeySchemaElement("SortKey", KeyType.RANGE))
				.withProvisionedThroughput(
						new ProvisionedThroughput(new Long(10), new Long(10)))
				.withAttributeDefinitions(measuredAttributeDefinitions)
				.withStreamSpecification(streamSpecification);

		CreateTableRequest createTestTableRequest = new CreateTableRequest()
				.withTableName(OpcUAClientConstants.TEST_DATA_TABLE)
				.withKeySchema(
						new KeySchemaElement(
								OpcUAClientConstants.TEST_DATA_COL_1,
								KeyType.HASH))
				.withProvisionedThroughput(
						new ProvisionedThroughput(new Long(10), new Long(10)))
				.withAttributeDefinitions(testDataAttributeDefinitions)
				.withStreamSpecification(streamSpecification);

		List<AttributeDefinition> vibrationAttributeDefinitions = new ArrayList<>();
		vibrationAttributeDefinitions.add(new AttributeDefinition()
				.withAttributeName(OpcUAClientConstants.TEST_DATA_COL_1)
				.withAttributeType(ScalarAttributeType.S));
		vibrationAttributeDefinitions.add(new AttributeDefinition()
				.withAttributeName("SortKey").withAttributeType(
						ScalarAttributeType.N));

		CreateTableRequest createVibrationTrainingTableRequestImp1 = new CreateTableRequest()
				.withTableName(
						OpcUAClientConstants.VIBRATION_TRAINING_TABLE_IMPELLAR_ONE)
				.withKeySchema(
						new KeySchemaElement(
								OpcUAClientConstants.VIBRATION_TRAINING_TABLE_COL_1,
								KeyType.HASH))
				.withKeySchema(new KeySchemaElement("SortKey", KeyType.RANGE))
				.withProvisionedThroughput(
						new ProvisionedThroughput(new Long(10), new Long(10)))
				.withAttributeDefinitions(vibrationAttributeDefinitions)
				.withStreamSpecification(streamSpecification);

		CreateTableRequest createVibrationTrainingTableRequestImp2 = new CreateTableRequest()
				.withTableName(
						OpcUAClientConstants.VIBRATION_TRAINING_TABLE_IMPELLAR_TWO)
				.withKeySchema(
						new KeySchemaElement(
								OpcUAClientConstants.VIBRATION_TRAINING_TABLE_COL_1,
								KeyType.HASH))
				.withKeySchema(new KeySchemaElement("SortKey", KeyType.RANGE))
				.withProvisionedThroughput(
								new ProvisionedThroughput(new Long(10), new Long(10)))
				.withAttributeDefinitions(vibrationAttributeDefinitions)
				.withStreamSpecification(streamSpecification);

		CreateTableRequest createVibrationTrainingTableRequestImp3 = new CreateTableRequest()
				.withTableName(
						OpcUAClientConstants.VIBRATION_TRAINING_TABLE_IMPELLAR_THREE)
				.withKeySchema(
						new KeySchemaElement(
								OpcUAClientConstants.VIBRATION_TRAINING_TABLE_COL_1,
								KeyType.HASH))
				.withKeySchema(new KeySchemaElement("SortKey", KeyType.RANGE))
				.withProvisionedThroughput(
						new ProvisionedThroughput(new Long(10), new Long(10)))
				.withAttributeDefinitions(vibrationAttributeDefinitions)
				.withStreamSpecification(streamSpecification);
		
		CreateTableRequest createVibrationTestingTrainingTableRequest = new CreateTableRequest()
		.withTableName(
				OpcUAClientConstants.VIBRATION_TESTING_TABLE)
		.withKeySchema(
				new KeySchemaElement(
						OpcUAClientConstants.VIBRATION_TRAINING_TABLE_COL_1,
						KeyType.HASH))
		.withKeySchema(new KeySchemaElement("SortKey", KeyType.RANGE))
		.withProvisionedThroughput(
				new ProvisionedThroughput(new Long(10), new Long(10)))
		.withAttributeDefinitions(vibrationAttributeDefinitions)
		.withStreamSpecification(streamSpecification);
		
		List<AttributeDefinition> alarmAttributeDefinitions = new ArrayList<>();
		alarmAttributeDefinitions.add(new AttributeDefinition()
				.withAttributeName(OpcUAClientConstants.TEST_DATA_COL_1)
				.withAttributeType(ScalarAttributeType.S));
		
		CreateTableRequest createAlarmTableRequest = new CreateTableRequest()
		.withTableName(
				OpcUAClientConstants.ALARM_TABLE)
		.withKeySchema(
				new KeySchemaElement(
						OpcUAClientConstants.TEST_DATA_COL_1,
						KeyType.HASH))
		.withProvisionedThroughput(
				new ProvisionedThroughput(new Long(10), new Long(10)))
		.withAttributeDefinitions(alarmAttributeDefinitions)
		.withStreamSpecification(streamSpecification);
		
		List<AttributeDefinition> learningTriggerAttributeDefinitions = new ArrayList<>();
		learningTriggerAttributeDefinitions.add(new AttributeDefinition()
				.withAttributeName(OpcUAClientConstants.TEST_DATA_COL_1)
				.withAttributeType(ScalarAttributeType.S));
		
		CreateTableRequest createPredictionRequest = new CreateTableRequest()
		.withTableName(
				OpcUAClientConstants.PREDICTION_TABLE)
		.withKeySchema(
				new KeySchemaElement(
						OpcUAClientConstants.TEST_DATA_COL_1,
						KeyType.HASH))
		.withProvisionedThroughput(
				new ProvisionedThroughput(new Long(10), new Long(10)))
		.withAttributeDefinitions(alarmAttributeDefinitions)
		.withStreamSpecification(streamSpecification);
		
		try {
			// CreateTableResult result =
			// client.createTable(createTableRequest);
			TableUtils.createTableIfNotExists(client, createParamTableRequest);
			TableUtils.createTableIfNotExists(client,
					createMeasuredTableRequest);
			TableUtils.createTableIfNotExists(client, createTestTableRequest);
			TableUtils.createTableIfNotExists(client,
					createVibrationTrainingTableRequestImp1);
			TableUtils.createTableIfNotExists(client,
					createVibrationTrainingTableRequestImp2);
			TableUtils.createTableIfNotExists(client,
					createVibrationTrainingTableRequestImp3);
			TableUtils.createTableIfNotExists(client,
					createVibrationTestingTrainingTableRequest);
			TableUtils.createTableIfNotExists(client,
					createAlarmTableRequest);
			TableUtils.createTableIfNotExists(client,
					createPredictionRequest);

		} catch (AmazonServiceException e) {
			System.err.println(e.getErrorMessage());
			System.exit(1);
		}
	}

	public void updateTable(Map<String, AttributeValue> measuredMap) {
		Calendar cal = Calendar.getInstance();
		SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss.SS");
		String currentTimeStamp = sdf.format(cal.getTime());
		measuredMap.put(OpcUAClientConstants.TIMESTAMP,
				new AttributeValue().withS(currentTimeStamp));
		PutItemRequest putDataMeasured = new PutItemRequest().withTableName(
				OpcUAClientConstants.MEASURED_DATA_TABLE).withItem(measuredMap);
		PutItemResult putItemResult = client.putItem(putDataMeasured);
	}

	public void updateParameterizedTable() {

		Calendar cal = Calendar.getInstance();
		SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss.SS");
		String currentTimeStamp = sdf.format(cal.getTime());

		Map<String, AttributeValue> parameterizedAttributeValues = new HashMap<>();
		parameterizedAttributeValues.put(OpcUAClientConstants.TEST_DATA_COL_1,
				new AttributeValue().withS("1"));
		parameterizedAttributeValues.put(OpcUAClientConstants.TEST_DATA_COL_2,
				new AttributeValue().withS("0"));
		parameterizedAttributeValues.put(OpcUAClientConstants.TEST_DATA_COL_3,
				new AttributeValue().withS("40.55"));
		parameterizedAttributeValues.put(OpcUAClientConstants.TEST_DATA_COL_4,
				new AttributeValue().withS("2.06"));
		// parameterizedAttributeValues.put(OpcUAClientConstants.PARAMETERIZED_DATA_COL_6,new
		// AttributeValue().withS("60"));
		// parameterizedAttributeValues.put(OpcUAClientConstants.PARAMETERIZED_DATA_COL_7,new
		// AttributeValue().withS("70"));
		parameterizedAttributeValues.put(OpcUAClientConstants.TIMESTAMP,
				new AttributeValue().withS(currentTimeStamp));

		PutItemRequest putDataParam = new PutItemRequest().withTableName(
				OpcUAClientConstants.TEST_DATA_TABLE).withItem(
				parameterizedAttributeValues);
		PutItemResult putItemResult1 = client.putItem(putDataParam);
	}
}
