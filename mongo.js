const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log(`give password as argument`)
    process.exit(1)
}

// salasana argumenttina
const password = process.argv[2]

const dbName = "phonebook-app"

const url =
`mongodb+srv://tayspino:${password}@cluster0.ufxii.mongodb.net/${dbName}?retryWrites=true&w=majority`

// yhteys auki
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

// jos annettiin pelkka salasana -> tulostetaan kaikki
if (process.argv.length === 3) {
    Person.find({}).then(result => {
        console.log(`phonebook:`)
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}

// annettiin lisattava henkilo ja numero parametrina
if (process.argv.length === 5) {
    const person = new Person({
        name: `${process.argv[3]}`,
        number: `${process.argv[4]}`
    })

    person.save().then(response => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    })
}
