// Import database
const knex = require('./../db')

// Retrieve all bisogni
exports.getAll = async (req, res) => {
    // Get all bisogni from database
    knex
        .select('*') // select all records
        .from('bisogni') // from 'books' table
        .then(userData => {
            // Send books extracted from database in response
            res.json(userData)
        })
        .catch(err => {
            // Send a error message in response
            res.json({ message: `There was an error retrieving books: ${err}` })
        })
}

// Get bisogno by ID
exports.getById = async (req, res) => {
    // Get bisogno from database based on ID
    knex('bisogni')
        .where('id', req.body.id) // find correct record based on id
        .first() // Get only the first matching record
        .then(bisogno => {
            if (!bisogno) {
                // If no book found with the given ID, send a 404 Not Found response
                res.status(404).json({ message: `Bisogno con ID ${bookId} not found.` });
            } else {
                // If book found, send it in response
                res.json(bisogno);
            }
        })
        .catch(err => {
            // Send an error message in response
            res.status(500).json({ message: `Error retrieving book with ID ${bookId}: ${err}` });
        });
}


// Create new bisogno
exports.Create = async (req, res) => {
    // Add new bisogno to database
    knex('bisogni')
        .insert({ // insert new record, a book
            'nome': req.body.nome,
            'importanza': req.body.importanza,
            'tolleranza': req.body.tolleranza,
            'inseritoil': req.body.inseritoil,
            'ultimasoddisfazione:': req.body.ultimasoddisfazione
        })
        .then(() => {
            // Send a success message in response
            res.json({ message: `Bisogno \'${req.body.nome}\' inserito.` })
        })
        .catch(err => {
            // Send a error message in response
            res.json({ message: `There was an error creating ${req.body.title} book: ${err}` })
        })
}

// Remove specific book
exports.Delete = async (req, res) => {
    // Find specific book in the database and remove it
    knex('bisogni')
        .where('id', req.body.id) // find correct record based on id
        .del() // delete the record
        .then(() => {
            // Send a success message in response
            res.json({ message: `Bisogno ${req.body.id} eliminato.` })
        })
        .catch(err => {
            // Send a error message in response
            res.json({ message: `C'è stato un errore nell\'eliminazione del bisogno con id: ${req.body.id} book: ${err}` })
        })
}

// Remove all books on the list
exports.Reset = async (req, res) => {
    // Remove all books from database
    knex
        .select('*') // select all records
        .from('books') // from 'books' table
        .truncate() // remove the selection
        .then(() => {
            // Send a success message in response
            res.json({ message: 'Book list cleared.' })
        })
        .catch(err => {
            // Send a error message in response
            res.json({ message: `There was an error resetting book list: ${err}.` })
        })
}