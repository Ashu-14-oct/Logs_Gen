const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

const uri = "mongodb://127.0.0.1:27017/Ashu";
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

             // clone context so we don’t mutate original doc
            const context = { ...request?.context };

            // replace bap_uri if it matches localhost
            if (context?.bap_uri === "http://localhost:8000/buyer/protocol") {
                context.bap_uri = "https://ondc.sequelstring.com/buyer/protocol";
            }
            if(context?.bpp_uri === "http://localhost:5006/seller/protocol"){
                context.bpp_uri = "https://ondc.sequelstring.com/seller/protocol";
            }
            const output = {
                context: context,
                message: request?.message
            }

             // File name like "1_search.json"
            const fileName = `${index + 1}_${action}.json`;
            const filePath = path.join(logDir, fileName);

            fs.writeFileSync(filePath, JSON.stringify(output, null, 2));
            console.log(`✅ Saved ${fileName}`);
        });

        console.log("Export completed.");
    } catch (error) {
        console.error("Error exporting transaction logs:", error);
    } finally {
        await client.close();
    }
}
const prompt = require("prompt-sync")();

const txId = prompt("Enter Transaction ID: ");

exportTransactionLogs(txId || "b662fc7e-8987-4a64-ad95-a0e823a9479b");