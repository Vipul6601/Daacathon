package com.siemens.decathon.opcUAClient;

import com.siemens.decathon.Constants.OpcUAClientConstants;

public class OpcUAClientComponent {

	private static OpcUAClient opcUAClient;
	private static OpcUAClientSubscriber opcUAClientSubs;

	public static void main(String[] args) {	
		opcUAClient = new OpcUAClient();
		opcUAClientSubs = new OpcUAClientSubscriber();
		try {
			opcUAClient.getApplicationURI(OpcUAClientConstants.APPLICATION_URI);
			opcUAClient.getEndPoints(0);
			opcUAClient.getNodes(0, 0);
		} catch (Exception e) {
			e.printStackTrace();
		}	
		opcUAClientSubs.subscribe(opcUAClient);
	}
}
