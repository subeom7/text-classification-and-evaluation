const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const { PythonShell } = require('python-shell');

const app = express();
const port = process.env.PORT || 5000;

//allows requests from different origins (e.g. different domains or ports) to access resources on the server
app.use(cors());

app.use(bodyParser.json());

let savedText = "";

app.post('/api', (req, res) => {
  const text = req.body.text;
  console.log(`Received text: ${text}`);
  savedText = text;
  res.send(text);
});

app.get('/api/getText', (req, res) => {
  const text = savedText;
  console.log(`Sending text: ${text}`);
  res.send(text);
});

//Sets up GET request & asynchronous handles request and response objects
app.get('/result', async (req, res) => {
  //Configure PythonShell with the path to the classifier.py file
  const options = {
    mode: 'text',
    pythonOptions: ['-u'], //sets the unbuffered I/O mode for the Python interpreter.
    scriptPath: './',
    timeout: 10000,
  };

  try {
    //Execute the classifier.py script asynchronously
    const resultPromise = PythonShell.run('classifier.py', options);

    // Wait for the result to become available and then parse the generated random number (classifier result) from the Python script output
    const result = await resultPromise;
    const classifierResult = result[0];

    // const data = {  message: 'Hello from the server!', randomNumber: randomNumber };

    //Send a JSON response back to the client with the generated random number and the message
    const data = { result: classifierResult };
    res.json(data);
  } catch (err) {
    console.error(err);

    if (err instanceof PythonShell.Error) {
      res.status(500).send('PythonShell Error');
    } else {
      res.status(500).send('Internal Server Error');
    }
  }
  
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
