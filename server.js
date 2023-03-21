// This server.js file will be used in the future once more front-end features are implemented,
// and requests to the back-end are necessary. The code below serves as a template for the
// upcoming implementation and will be updated accordingly.

// Import required modules
const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");

// Set server port from environment variable or use 5001 as a default
const port = process.env.PORT || 5001;

// Initialize Express app
const app = express();

//allows cross-domain requests / requests from different origins (e.g. different domains or ports) to access resources on the server
app.use(cors());

// Use body-parser middleware to parse incoming request bodies in JSON format
app.use(bodyParser.json());

// Define a POST route to handle incoming API requests
app.post('/api/', async (req, res) => {
  // Extract the text from the request body
  const savedText = req.body.text;

  try {
    // Make a POST request to the specified API endpoint with the saved text as the payload
    const response = await fetch('http://localhost:5001/someAPI', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: savedText }),
    });
    // Parse the response as JSON
    const data = await response.json();
    // Send the parsed response data to the client with a 200 status code
    res.status(200).json(data);
  } catch (err) {
    // Log any errors and send a 500 status code with an error message to the client
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server and listen for incoming requests on the specified port
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

