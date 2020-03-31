const axios = require('axios');
const express = require('express')
const app = express()

const PORT = process.env.PORT;

const OTHER_CONTAINER = process.env.OTHER_CONTAINER;
const OTHER_PORT = process.env.OTHER_PORT;

app.get('*', (req, res) => res.send('Hello World from B!'))

async function getMessage() {
    try {
        const response = await axios.get(`http://${OTHER_CONTAINER}:${OTHER_PORT}`);
        console.log(`Message Receieved from OTHER CONTAINER: ${response.data}`);
    } catch (err) {
        console.log('Error requesting data from OTHER CONTAINER');
    }
}

setInterval(getMessage, 5000);

app.listen(PORT, () => console.log(`App B listening on port ${PORT}!`))