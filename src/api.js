const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.DATABASE_URL,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
});

global.session = Math.floor(Math.random()*10000000)

router.get("/newsession", async (req, res) => {
    try {
        global.session = Math.floor(Math.random()*10000000)
        res.send(`${global.session}`);
    } catch (err) {
        // Report errors
        console.error(err);
        res.send("Error " + err); 
    }
});

router.get("/session", async (req, res) => {
    try {
        res.send(`${global.session}`);
    } catch (err) {
        // Report errors
        console.error(err);
        res.send("Error " + err); 
    }
});

router.get("/sessions", async (req, res) => {
    try {
        // Wait for DB connectionconst 
        client = await pool.connect();
        // Run query
        const result = await client.query("SELECT session, MIN(date) FROM sensordata GROUP BY session;");
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

router.get("/allfromsession", async (req, res) => {
    try {
        // Wait for DB connectionconst 
        client = await pool.connect();
        // Run query
        const result = await client.query("SELECT * FROM sensordata WHERE session = $1", [
            req.query.session
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
