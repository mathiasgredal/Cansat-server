const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.DATABASE_URL,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
});

router.get("/date", async (req, res) => {
    try {
        // Wait for DB connectionconst 
        client = await pool.connect();
        // Run query
        const result = await client.query("SELECT * FROM sensordata WHERE date > to_timestamp($1)", [
            req.query.date
        ]);
        // Respond with DB results as json
        if (result)
            res.send(JSON.stringify(result.rows, null, 2));
        else
            res.json(null);
        // Release connection        
        client.release();
    } catch (err) {
        // Report errors
        console.error(err);
        res.send("Error " + err);
    }
});

router.get("/all", async (req, res) => {
    try {
        // Wait for DB connectionconst 
        client = await pool.connect();
        // Run query
        const result = await client.query("SELECT * FROM sensordata");
        // Respond with DB results as json
        if (result)
            res.send(JSON.stringify(result.rows, null, 2));
        else
            res.json(null);
        // Release connection        
        client.release();
    } catch (err) {
        // Report errors
        console.error(err);
        res.send("Error " + err);
    }
});



router.get("/clear", async (req, res) => {
    try {
        // Wait for DB connectionconst 
        client = await pool.connect();
        // Run query
        const result = await client.query("TRUNCATE TABLE sensordata");

        res.send("Cleared");  

        client.release();
    } catch (err) {
        // Report errors
        console.error(err);
        res.send("Error " + err); 
    }
});

module.exports = router;
