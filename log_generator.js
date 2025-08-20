const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

const uri = "mongodb://localhost:27017/Ashu";
const dbName = "ondcFISBuyer";
const collectionName = "logs";

async function exportTransactionLogs(transactionId){
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        //fetch document...
        const docs = await collection.find({ transaction_id: transactionId }).sort({created_at: 1}).toArray();
        if(!docs.length) {
            console.log("No documents found for transaction:", transactionId);
            return;
        }

        //Make files
        const logDir = path.join(process.cwd(), `logs_${transactionId}`);
        if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

        //process each doc
        docs.forEach((doc, index) => {
            const {request, action} = doc;
            const output = {
                context: request?.context,
                message: request?.message
            }

             // File name like "1_search.json"
            const fileName = `${index + 1}_${action}.json`;
            const filePath = path.join(logDir, fileName);

            fs.writeFileSync(filePath, JSON.stringify(output, null, 2));
            console.log(`✅ Saved ${fileName}`);
        });

        console.log("🎉 Export completed.");
    } catch (error) {
        console.error("Error exporting transaction logs:", error);
    } finally {
        await client.close();
    }
}


exportTransactionLogs("b7a13e1a-97fa-45dd-a3dd-cd02b45cb48b");