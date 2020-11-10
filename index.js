require('dotenv').config();

const { Pool } = require("pg");
createTables(); // Creates the tables in the database if they dont exist

const bodyParser = require("body-parser");
const express = require('express');
const app = express()

const api = require("./src/api")
const mqtt = require("./src/mqtt")


app.use(express.static('./myapp/dist'))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api", api)


app.listen(process.env.PORT, () => {
    console.log(`Run at http://teknik.gred.al`)
})


function createTables() {
    const pool = new Pool({
        host: process.env.DATABASE_URL,
        user: process.env.DB_USER,
        password: process.env.DB_PASS
    });
    
    pool.connect().then(async (client)=> { 
        try {
        await client.query(`
        CREATE TABLE IF NOT EXISTS sensordata (
            id int GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
            session int,
            date TIMESTAMP WITH TIME ZONE DEFAULT(NOW()),
            temperature NUMERIC, 
            pressure NUMERIC,
            accelX NUMERIC,
            accelY NUMERIC,
            accelZ NUMERIC,
            latitude NUMERIC,
            longitude NUMERIC
          )`);  
    
        } catch (err) {
            // Report errors
            console.error(err);
        }
    }); 
}