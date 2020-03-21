const express = require('express')
const app = express()

const PORT = 3000

const MESSAGE1 = process.env.MESSAGE1;
const MESSAGE2 = process.env.MESSAGE2;

app.get('*', (req, res) => res.send(`${MESSAGE1} ${MESSAGE2}`))

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))