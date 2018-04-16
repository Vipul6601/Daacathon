package backup.testDynamoDb;

public class Simulation {
	
	public static void main(String[] args) {
		
		for(int i=0; i<100; i++)
		{  
		
			DynamoDatabase database = new DynamoDatabase();
			database.updateTable(null);
			try {
				Thread.sleep(3000);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}

	
}
