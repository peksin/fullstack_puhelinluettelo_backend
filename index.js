require('dotenv').config()
const express = require('express')
const {response} = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')


// middlewaret kayttoon
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))
app.use(express.static('build'))


morgan.token('type', (req, res) => JSON.stringify(req.body))

const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'})
}

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
//////////////////////
/*
 * Routet tanne
 */
///////////////////////

// get hello world
app.get('/', (req, res) => {
    res.send(`<h1>Hello world!</h1>`)
})

// get info
app.get('/info', (req, res) => {
    let dateAndTime = new Date()
    let date = dateAndTime.toDateString()
    let time = dateAndTime.toTimeString()
    Person.find({}).then(persons => {
        res.send(
            `<div>Phonebook has info for ${persons.length} people<br/>
            ${date} ${time}</div>`)
    })


})

// get all
app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

// get one contact
app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            } else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})

// delete one contact
app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})


// create one contact
app.post('/api/persons', (req, res, next) => {

    // bodyssa tulee asiakkaan lahettamat tiedot
    const body = req.body

    // // jos tyhja nimi tai tyhja numero
    // if (!body.name || !body.number) {
    //     // 400 bad request
    //     return res.status(400).json({
    //         error: 'name or number missing'
    //     })
    // }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person
        .save()
        .then(savedPerson => {
        res.json(savedPerson)
    })
    .catch(error => next(error))
})

// update one note
app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number,
    }

    // new: true oltava etta parametri updatedPerson on muutoksen
    // JALKEINEN versio
    Person.findByIdAndUpdate(req.params.id, person, {new: true})
        .then(updatedPerson => {
            res.json(updatedPerson)
        })
        .catch(error => next(error))
})

// ei mennyt millekaan routelle hoitoon =>
app.use(unknownEndpoint)

// virheiden kasittelija
const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return res.status(400).send({error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({error: error.message})
    }

    next(error)
}

app.use(errorHandler)

// palvelin kayntiin
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})