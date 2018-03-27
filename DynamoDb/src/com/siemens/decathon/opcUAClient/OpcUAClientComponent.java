package com.siemens.decathon.opcUAClient;

public class OpcUAClientComponent {

	private static OpcUAClient opcUAClient;
	private static OpcUAClientSubscriber opcUAClientSubs;

	public static void main(String[] args) {	
		opcUAClient = new OpcUAClient();
		opcUAClientSubs = new OpcUAClientSubscriber();
		try {
			opcUAClient.getApplicationURI("opc.tcp://192.168.19.58:53530/OPCUA/SimulationServer");
			opcUAClient.getEndPoints(0);
			opcUAClient.getNodes(0, 0);
		} catch (Exception e) {
			e.printStackTrace();
		}	
		opcUAClientSubs.subscribe(opcUAClient);
	}
}
