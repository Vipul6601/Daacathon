package com.siemens.decathon.opcUAClient;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.opcfoundation.ua.builtintypes.DataValue;
import org.opcfoundation.ua.builtintypes.ExpandedNodeId;
import org.opcfoundation.ua.builtintypes.NodeId;
import org.opcfoundation.ua.core.Attributes;
import org.opcfoundation.ua.core.MonitoringMode;

import com.prosysopc.ua.client.MonitoredDataItem;
import com.prosysopc.ua.client.MonitoredDataItemListener;
import com.siemens.decathon.Constants.OpcUAClientConstants;
import com.siemens.decathon.testDynamoDb.DynamoDatabase;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;

public class OpcUAClientSubscriber {
	
	private int counter = 0;
	private DynamoDatabase dynamoDatabase;
	private Map <String,AttributeValue> measuredMap  = new HashMap<String,AttributeValue>();
	public OpcUAClientSubscriber() {
			dynamoDatabase = new DynamoDatabase();
	}
	
	public void subscribe(OpcUAClient opcUAClient){
		List<ExpandedNodeId> nodeIDsList = opcUAClient.nodeIDsList;
		try {
			if (!nodeIDsList.isEmpty()) {
				for (Iterator<ExpandedNodeId> iterator = nodeIDsList.iterator(); iterator.hasNext();) {
					ExpandedNodeId expandedNodeId = (ExpandedNodeId) iterator.next();
					MonitoredDataItem item = new MonitoredDataItem(
							new NodeId(expandedNodeId.getNamespaceIndex(), (String) expandedNodeId.getValue()),
							Attributes.Value, MonitoringMode.Reporting);
					item.addChangeListener(this.dataChangeListener);
					opcUAClient.subscription.addItem(item);
				}
			}
		} catch (Exception e) {
			System.err.println(e);
		}
	}
	
	private MonitoredDataItemListener dataChangeListener = new MonitoredDataItemListener() {

		
		public void onDataChange(MonitoredDataItem node, DataValue prevValue, DataValue value) {
			
			if(!measuredMap.containsKey(node.getNodeId().getValue().toString()))
				measuredMap.put(node.getNodeId().getValue().toString(), new AttributeValue().withS(node.getValue().getValue().toString()));
			else 
			{
				measuredMap.put(OpcUAClientConstants.MEASURED_DATA_COL_1, new AttributeValue().withS(++counter+""));
			 	dynamoDatabase.updateTable(measuredMap);
				measuredMap.clear();
				measuredMap.put(node.getNodeId().getValue().toString(), new AttributeValue().withS(node.getValue().getValue().toString()));
			}	
		}
	};
}
