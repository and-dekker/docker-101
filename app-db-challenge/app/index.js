const express = require('express')
const app = express()
const { Client } = require('pg');
const PORT = 3000

const dbClient = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
})

async function main() {
    app.get('*', (req, res) => res.send('Hello World!'))

    try {
        await dbClient.connect();
    } catch (e) {
        console.error("ERROR CONNECTING TO DATABASE");
        throw e;
    }

    app.listen(PORT, () => console.log(`Challenge App listening on port ${PORT}!`))
}

main().catch(() => process.exit(1));
