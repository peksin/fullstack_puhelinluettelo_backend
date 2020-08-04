const express = require('express')
const {response} = require('express')
const app = express()

app.use(express.json())

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendick",
        number: "39-23-6423122",
        id: 4
    },

]

app.get('/', (req, res) => {
    res.send(`<h1>Hello world!</h1>`)
})

// get info
app.get('/info', (req, res) => {
    let date = new Date().toDateString()
    let time = new Date().toTimeString()
    res.send(
        `<div>Phonebook has info for ${persons.length} people<br/>
        ${date} ${time}</div>`)
})

// get all
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})