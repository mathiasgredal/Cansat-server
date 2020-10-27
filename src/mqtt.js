var mqtt = require('mqtt');
const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.DATABASE_URL,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
});


// We are using a test broker for now
const serverUrl   = "mqtt://mqtt.eclipse.org:1883";
const clientId    = "cansat_server";

const client = mqtt.connect(serverUrl, {
    clientId: clientId
});

client.on("connect", function () {
    // For right now we just listen, in the future we should also be able to send commands to the cansat
    client.subscribe("cansat_telemetry");
});


client.on("message", function (topic, message) {
    if(topic === 'cansat_telemetry') {
        handleTelemetry(JSON.parse(message));
    }
});


async function handleTelemetry(data) {
    try {
        let db_client = await pool.connect();

        // We can pull out each important value
        const sessionID = data.session; // A sessionID is just a random UUID, used to differentiate sessions
        const temperature = data.temperature;
        const pressure = data.pressure;
        const height = data.height;
        const accelX = data.accelX;
        const accelY = data.accelY;
        const accelZ = data.accelZ;


        const result = await db_client.query("INSERT INTO sensordata (temperature, pressure, accelX, accelY, accelZ) VALUES ($1, $2, $3, $4, $5)", 
        [temperature, pressure, accelX, accelY, accelZ]);

        db_client.release();
    } catch (error) {
        console.error(error);
    }
}