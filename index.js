const express = require('express')
const {response} = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))
app.use(express.static('build'))


morgan.token('type', (req, res) => JSON.stringify(req.body))

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


const generateId = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)

    return Math.floor(Math.random() * (max - min)) + min
}


// get info
app.get('/', (req, res) => {
    res.send(`<h1>Hello world!</h1>`)
})

// get info
app.get('/info', (req, res) => {
    let dateAndTime = new Date()
    let date = dateAndTime.toDateString()
    let time = dateAndTime.toTimeString()
    res.send(
        `<div>Phonebook has info for ${persons.length} people<br/>
        ${date} ${time}</div>`)
})

// get all
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

// get one contact
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

// delete one contact
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    console.log(`${id}`)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

// create one contact
app.post('/api/persons', (req, res) => {

    // bodyssa tulee asiakkaan lahettamat tiedot
    const body = req.body

    // jos tyhja nimi tai tyhja numero
    if (!body.name || !body.number) {
        // 400 bad request
        return res.status(400).json({
            error: 'name or number missing'
        })
    }

    if (persons.filter(person => person.name === body.name).length !== 0) {
        // 409 conflict
        return res.status(409).json({
            error: 'name already in phonebook'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(10, 1000),
    }

    persons = persons.concat(person)
    res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})