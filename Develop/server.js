const express = require('express');
const fs = require('fs');
const path = require('path');

// Helper method for generating unique ids
const uuid = require('./helpers/uuid');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


// HTML routes
app.get('/', (req, res) =>
	res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.get('/notes', (req, res) =>
	res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('*', (req, res) =>
	res.sendFile(path.join(__dirname, 'public/index.html'))
);

// Get request for notes
app.get('/api/notes', (req, res) => {

	// Send a message to the client
	res.status(200).json(`${req.method} request received to get reviews`);

	// Log our request to the terminal
	console.info(`${req.method} request received to get notes`);
});

// POST request to add a note
app.post('/api/notes', (req, res) => {
	// Log that a POST request was received
	console.info(`${req.method} request received to add a note`);

	// Destructuring assignment for the items in req.body
	const { title, text } = req.body;

	// If all the required properties are present
	if (title && text) {
		// Variable for the object we will save
		const newNote = {
			title,
			text,
			review_id: uuid(),
		};

		// Obtain existing reviews
		fs.readFile('./db/notes.json', 'utf8', (err, data) => {
			if (err) {
				console.error(err);
			} else {
				// Convert string into JSON object
				const parsedNotes = JSON.parse(data);

				// Add a new note
				parsedNotes.push(newNote);

				// Write updated notes back to the file
				fs.writeFile(
					'./db/notes.json',
					JSON.stringify(parsedNotes, null, 3),
					(writeErr) =>
						writeErr
							? console.error(writeErr)
							: console.info('Successfully updated notes!')
				);
			}
		});

		const response = {
			status: 'success',
			body: newNote,
		};

		console.log(response);
		res.status(201).json(response);
	} else {
		res.status(500).json('Error in posting review');
	}
});

app.listen(PORT, () =>
	console.log(`app listening at http://localhost:${PORT}`)
);