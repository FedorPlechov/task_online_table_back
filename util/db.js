const {MongoClient, ObjectID} = require("mongodb");
// Connection URI
const uri =
    "mongodb://localhost:27017/";
// Create a new MongoClient
const client = new MongoClient(uri);
module.exports.run = async function run() {
    try {
        // Connect the client to the server
        await client.connect();
        // Establish and verify connection
        await client.db("dispatches").command({ping: 1});
        console.log("Connected successfully to server");
    } catch (e) {
        console.log(e);
        await client.close();
    }

}

exports.findAllStr = async function getTable() {
    const cursor = await client.db("test_task_db").collection("table").find()

    if ((await cursor.count()) === 0) {
        console.log("No documents found!");
        await cursor.forEach(console.dir);
    }
    return await cursor.toArray()
}

exports.insertOneString = async function insertString({indexNewStr, string}) {
    const result = await client.db("test_task_db").collection("table").insertOne({
        indexStr: indexNewStr - 2,
        str: string
    });
    console.log(`New products created with the following id: ${result.insertedId}`);
}
exports.deleteLastString = async function deleteString({indexString}) {
    const result = await client.db("test_task_db").collection("table").deleteOne({indexStr: indexString});
    console.log(`Deleted: ${result.deletedCount}`);
}
exports.addColumn = async function addColumn({arrayOfCell, indexAddedColumn}) {
    for (let i = 0; i < arrayOfCell.length; i++) {
        const result = await client.db("test_task_db").collection("table").findOne({indexStr: i});
        result.str.splice(indexAddedColumn, 0, arrayOfCell[i]);
        const update = await client.db("test_task_db").collection("table").updateOne({indexStr: i}, {$set: {str: result.str}});
    }
}
exports.deleteColumn = async function deleteColumn({indexDeletedColumn, quantityStrings}) {

    for (let i = 0; i < quantityStrings; i++) {
        const result = await client.db("test_task_db").collection("table").findOne({indexStr: i});
        result.str.splice(indexDeletedColumn, 1);
        const update = await client.db("test_task_db").collection("table").updateOne({indexStr: i}, {$set: {str: result.str}});
    }
}
exports.updateCell = async function updateCell({indexString, indexColumn, content, id}) {
    const result = await client.db("test_task_db").collection("table").updateOne({indexStr: indexString}, {
        $set: {
            [`str.${indexColumn}`]: {
                "id": id,
                "content": content
            }
        }
    })
}
