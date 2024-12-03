const ex = require("express");
const app = ex();
const { MongoClient } = require("mongodb");
const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/delete1', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('court');
        const result = await db.collection('crime').deleteMany({ punishment: "As per legal provisions" });
        if (result.deletedCount > 0) {
            res.send("Delete successful");
        } else {
            res.send("No documents matched the deletion criteria");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while deleting documents");
    } finally {
        await client.close();
    }
});

app.listen(9009, () => {
    console.log("Server is running on port 9009");
});
