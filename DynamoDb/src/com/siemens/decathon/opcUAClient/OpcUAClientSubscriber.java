package com.siemens.decathon.opcUAClient;

import java.util.Iterator;
import java.util.List;

import org.opcfoundation.ua.builtintypes.DataValue;
import org.opcfoundation.ua.builtintypes.ExpandedNodeId;
import org.opcfoundation.ua.builtintypes.NodeId;
import org.opcfoundation.ua.core.Attributes;
import org.opcfoundation.ua.core.MonitoringMode;

import com.prosysopc.ua.client.MonitoredDataItem;
import com.prosysopc.ua.client.MonitoredDataItemListener;
import com.siemens.decathon.testDynamoDb.DynamoDatabase;

public class OpcUAClientSubscriber {
	
	
	private DynamoDatabase dynamoDatabase;
	
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
		private int counter = 0;
		
		public void onDataChange(MonitoredDataItem node, DataValue prevValue, DataValue value) {
		 //  dynamoDatabase.updateTable(node);
			System.err.println(node.getNodeId().getValue()+"-------------"+node.getValue().getValue());
			counter++;
		}
	};
}
