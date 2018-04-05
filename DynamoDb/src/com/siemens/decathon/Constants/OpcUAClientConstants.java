package com.siemens.decathon.Constants;

public class OpcUAClientConstants {

	public static final String APPLICATION_URI = "opc.tcp://192.168.19.58:53530/OPCUA/SimulationServer"; 
	public static final String ATTRIBUTE_COL_1 = "SignalName";
	public static final String ATTRIBUTE_COL_2 = "SignalValue";
	public static final String TIMESTAMP = "TimeStamp";
	public static final String TABLE_NAME ="Pump_Monitor9";


	public static final String MEASURED_DATA_TABLE ="MeasuredData2";
	public static final String MEASURED_DATA_COL_1 ="Id";
	public static final String MEASURED_DATA_COL_2 ="SuctionTemp";
	public static final String MEASURED_DATA_COL_3 ="DischargeTemp";
	public static final String MEASURED_DATA_COL_4 ="SuctionPressure";
	public static final String MEASURED_DATA_COL_5 ="DischargePressure";
	public static final String MEASURED_DATA_COL_6 ="FluidFlow";
	public static final String MEASURED_DATA_COL_7 ="MotorRpm";
	public static final String MEASURED_DATA_COL_8 ="ElectricPower";
	public static final String MEASURED_DATA_COL_9 ="PowerFactor";
	public static final String MEASURED_DATA_COL_10 ="OperatingHrs";
	public static final String MEASURED_DATA_COL_11 ="MotorCurrent";
	
	public static final String PARAMETERIZED_DATA_TABLE ="ParamaterizedData";
	public static final String PARAMETERIZED_DATA_COL_1 ="Id";
	public static final String PARAMETERIZED_DATA_COL_2 ="RatedPower";
	public static final String PARAMETERIZED_DATA_COL_3 ="RatedEfficiency";
	public static final String PARAMETERIZED_DATA_COL_4 ="RatedSpeed";
	public static final String PARAMETERIZED_DATA_COL_5 ="MinimumFlow";
	public static final String PARAMETERIZED_DATA_COL_6 ="ThresholdLimits";
	public static final String PARAMETERIZED_DATA_COL_7 ="RatedFlow";

	
	public static final String ACCESS_KEY = "TestAccessKey";
	public static final String SECRET_KEY = "TestSecretKey";
	public static final String URL = "http://localhost:8000";
	
}
