package com.siemens.decathon.opcUAClient;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.EnumSet;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;

import org.apache.log4j.Logger;
import org.opcfoundation.ua.application.Client;
import org.opcfoundation.ua.builtintypes.DataValue;
import org.opcfoundation.ua.builtintypes.ExpandedNodeId;
import org.opcfoundation.ua.builtintypes.LocalizedText;
import org.opcfoundation.ua.builtintypes.NodeId;
import org.opcfoundation.ua.common.ServiceResultException;
import org.opcfoundation.ua.core.ApplicationDescription;
import org.opcfoundation.ua.core.ApplicationType;
import org.opcfoundation.ua.core.Attributes;
import org.opcfoundation.ua.core.EndpointDescription;
import org.opcfoundation.ua.core.Identifiers;
import org.opcfoundation.ua.core.MonitoringMode;
import org.opcfoundation.ua.core.ReferenceDescription;
import org.opcfoundation.ua.transport.security.Cert;
import org.opcfoundation.ua.transport.security.SecurityMode;
import org.opcfoundation.ua.transport.security.SecurityPolicy;

import com.prosysopc.ua.ApplicationIdentity;
import com.prosysopc.ua.CertificateValidationListener;
import com.prosysopc.ua.MonitoredItemBase;
import com.prosysopc.ua.PkiFileBasedCertificateValidator;
import com.prosysopc.ua.SecureIdentityException;
import com.prosysopc.ua.ServiceException;
import com.prosysopc.ua.SessionActivationException;
import com.prosysopc.ua.StatusException;
import com.prosysopc.ua.UaApplication;
import com.prosysopc.ua.client.ConnectException;
import com.prosysopc.ua.client.InvalidServerEndpointException;
import com.prosysopc.ua.client.MonitoredDataItem;
import com.prosysopc.ua.client.MonitoredDataItemListener;
import com.prosysopc.ua.client.Subscription;
import com.prosysopc.ua.client.SubscriptionAliveListener;
import com.prosysopc.ua.client.UaClient;

//import src.ui.NodesSubscriptionBox;

/**
 * 
 * @author Z003JWFA
 *
 */
public class OpcUAClient
{
    private List<EndpointDescription> endPointDescriptionList;
    public List<ExpandedNodeId> nodeIDsList;
    private List<ReferenceDescription> references;
    private static ApplicationDescription[] applicationDescriptions;
    public Subscription subscription;
    private UaClient uaClient;
    // private NodesSubscriptionBox nodesSubscriptionBox;
    private static final Logger logger = Logger.getLogger(OpcUAClient.class);
    
    public OpcUAClient()
    {
        this.endPointDescriptionList = new ArrayList();
        this.nodeIDsList = new ArrayList();
    }
    
    public String[][] getEndPoints(int index)
        throws Exception
    {
        try
        {
            this.endPointDescriptionList = getEndPointList(index);
            String[][] endPoints = new String[this.endPointDescriptionList.size()][3];
            int i = 0;
            for (Iterator<EndpointDescription> iterator = this.endPointDescriptionList.iterator(); iterator.hasNext();)
            {
                EndpointDescription endpointDescription = (EndpointDescription) iterator.next();
                String securityPolicyUri = endpointDescription.getSecurityPolicyUri();
                endPoints[i][0] = endpointDescription.getEndpointUrl();
                endPoints[i][1] = endpointDescription.getSecurityMode().toString();
                endPoints[i][2] = securityPolicyUri.substring(securityPolicyUri.indexOf("#") + 1, securityPolicyUri.length());
                i++;
            }
            return endPoints;
        }
        catch (Exception e)
        {
            throw e;
        }
    }
    
    public List<String> getNodes(int referenceDescriptionIndex, int index)
        throws Exception
    {
        List<String> nodeList = new ArrayList();
        try
        {
            connect(referenceDescriptionIndex, index);
            
            PkiFileBasedCertificateValidator validator = new PkiFileBasedCertificateValidator();
            validator.setValidationListener(validationListener);
            
            this.uaClient.getAddressSpace().setMaxReferencesPerNode(1000);
            this.uaClient.getAddressSpace().setReferenceTypeId(Identifiers.HierarchicalReferences);
            
            this.references = this.uaClient.getAddressSpace().browse(Identifiers.ObjectsFolder);
            int simulationObjectIndex = 4;
            NodeId simulationNode = new NodeId(
                ((ReferenceDescription) this.references.get(simulationObjectIndex)).getNodeId().getNamespaceIndex(),
                (String) ((ReferenceDescription) this.references.get(simulationObjectIndex)).getNodeId().getValue());
            
            List<ReferenceDescription> referenceDescriptions = this.uaClient.getAddressSpace().browse(simulationNode);
            for (Iterator<ReferenceDescription> iterator = referenceDescriptions.iterator(); iterator.hasNext();)
            {
                ReferenceDescription referenceDescription = (ReferenceDescription) iterator.next();
                ExpandedNodeId nodeId = referenceDescription.getNodeId();
                this.nodeIDsList.add(nodeId);
                nodeList.add((String) nodeId.getValue());
            }
            this.subscription = new Subscription();
            this.uaClient.addSubscription(this.subscription);
        }
        catch (Exception e)
        {
            logger.error(e);
            throw e;
        }
        return nodeList;
    }
    
    private void connect(int referenceDescriptionIndex, int index)
        throws URISyntaxException, SecureIdentityException, IOException, ServiceResultException, ServiceException, ConnectException,
        SessionActivationException, InvalidServerEndpointException
    {
        EndpointDescription endpointDescription = (EndpointDescription) this.endPointDescriptionList.get(referenceDescriptionIndex);
        this.uaClient = new UaClient(endpointDescription.getEndpointUrl());
        
        ApplicationIdentity identity = ApplicationIdentity.loadOrCreateCertificate(getApplicationDescription(), "Organisation",
            null, null, true, new String[0]);
        this.uaClient.setApplicationIdentity(identity);
        
        this.uaClient.setSecurityMode(new SecurityMode(SecurityPolicy.getSecurityPolicy(endpointDescription.getSecurityPolicyUri()),
            endpointDescription.getSecurityMode()));
        
        this.uaClient.setAutoReconnect(true);
        
        // this.uaClient.addServerStatusListener(new ServerStatusChangeHandler());
        
        this.uaClient.connect();
    }
    
    private ApplicationDescription getApplicationDescription()
    {
        String APP_NAME = "SimulationServer";
        ApplicationDescription appDescription = new ApplicationDescription();
        appDescription.setApplicationName(new LocalizedText(APP_NAME + "@localhost", Locale.ENGLISH));
        appDescription.setApplicationUri("urn:localhost:OPCUA:" + APP_NAME);
        appDescription.setProductUri("urn:prosysopc.com:OPCUA:" + APP_NAME);
        appDescription.setApplicationType(ApplicationType.Client);
        return appDescription;
    }
    
    public void unsubscribe(String nodeID)
    {
        MonitoredItemBase[] items = this.subscription.getItems();
        for (int i = 0; i < items.length; i++)
        {
            if (((String) items[i].getNodeId().getValue()).equals(nodeID))
            {
                try
                {
                    this.subscription.removeItem(items[i]);
                    System.out.println("Unsubscribed for " + nodeID);
                    logger.info("Unsubscribed for " + nodeID);
                }
                catch (ServiceException | StatusException e)
                {
                    logger.error(e);
                }
            }
        }
    }
    
    public void subscribe(String nodeID)
    {
        try
        {
            if (!this.nodeIDsList.isEmpty())
            {
                for (Iterator<ExpandedNodeId> iterator = this.nodeIDsList.iterator(); iterator.hasNext();)
                {
                    ExpandedNodeId expandedNodeId = (ExpandedNodeId) iterator.next();
                    if (((String) expandedNodeId.getValue()).equals(nodeID))
                    {
                        MonitoredDataItem item = new MonitoredDataItem(
                            new NodeId(expandedNodeId.getNamespaceIndex(), (String) expandedNodeId.getValue()),
                            Attributes.Value,
                            MonitoringMode.Reporting);
                        item.addChangeListener(this.dataChangeListener);
                        this.subscription.addItem(item);
                        logger.info("Subscribed for " + nodeID);
                        break;
                    }
                }
            }
        }
        catch (Exception e)
        {
            logger.error(e);
        }
    }
    
    public void disconnect()
    {
        try
        {
            this.uaClient.removeSubscription(this.subscription);
        }
        catch (Exception e)
        {
            logger.error(e);
        }
        if (this.uaClient.isConnected())
        {
            this.uaClient.disconnect();
        }
        this.nodeIDsList.clear();
        logger.info("connection closed...");
    }
    
    public List<String> getApplicationURI(String serverUri)
        throws Exception
    {
        this.client = new Client();
        try
        {
            this.client.setApplicationUri(serverUri);
            applicationDescriptions = this.client.discoverApplications(serverUri);
        }
        catch (Exception e)
        {
            logger.error(e);
            throw e;
        }
        List<String> applicationsURI = new ArrayList();
        for (int i = 0; i < applicationDescriptions.length; i++)
        {
            applicationsURI.add(applicationDescriptions[i].getApplicationUri());
        }
        return applicationsURI;
    }
    
    private List<EndpointDescription> getEndPointList(int index)
        throws Exception
    {
        List<EndpointDescription> endpoints = new ArrayList();
        try
        {
            for (String url : applicationDescriptions[index].getDiscoveryUrls())
            {
                if (url.toLowerCase().startsWith(UaApplication.Protocol.Opc.toString()))
                {
                    endpoints.addAll(Arrays.asList(this.client.discoverEndpoints(url)));
                }
            }
        }
        catch (Exception exception)
        {
            logger.error(exception);
            throw exception;
        }
        return endpoints;
    }
    
    private static CertificateValidationListener validationListener = new CertificateValidationListener()
    {
        public PkiFileBasedCertificateValidator.ValidationResult onValidate(Cert certificate, ApplicationDescription applicationDescription,
            EnumSet<PkiFileBasedCertificateValidator.CertificateCheck> passedChecks)
        {
            return null;
        }
    };
    private MonitoredDataItemListener dataChangeListener = new MonitoredDataItemListener()
    {
        public void onDataChange(MonitoredDataItem node, DataValue prevValue, DataValue value)
        {
            // OpcUAClient.this.nodesSubscriptionBox.updateValue((String)node.getNodeId().getValue(),
            // String.valueOf(value.getValue().getValue()));
        }
    };
    
    /*
     * public void setNodesSubscriptionBox(NodesSubscriptionBox nodesSubscriptionBox)
     * {
     * this.nodesSubscriptionBox = nodesSubscriptionBox;
     * }
     */
    
    protected static SubscriptionAliveListener subscriptionAliveListener = new SubscriptionAliveListener()
    {
        public void onAlive(Subscription subscription)
        {
            OpcUAClient.logger.info("On Alive");
        }
        
        public void onTimeout(Subscription subscription)
        {
            OpcUAClient.logger.info("On Timeout");
        }
    };
    private Client client;
}
