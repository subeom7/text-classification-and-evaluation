const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const { PythonShell } = require('python-shell');

const app = express();
const port = process.env.PORT || 5001;

//allows requests from different origins (e.g. different domains or ports) to access resources on the server
app.use(cors());
//parse incoming request bodies in JSON format
app.use(bodyParser.json());

let savedText = "";

//set up an HTTP POST endpoint
app.post('/api', (req, res) => {
  const text = req.body.text;
  console.log(`Received text: ${text}`);
  savedText = text;
  res.send(text);
});

//create a GET endpoint and send back the user input that was received in the POST request
app.get('/api/getText', (req, res) => {
  const text = savedText;
  console.log(`Sending text: ${text}`);
  res.send(text);
});

//Sets up GET request & asynchronously handle request and response objects
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

    // Wait for the result to become available and then parse the generated classifier result from the Python script output
    const result = await resultPromise;
    const classifierResult = result[0];

    //Send a JSON response back to the client with the generated classifier result
    // const data = { result: classifierResult };
    // res.json(data);
    res.send(classifierResult);
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
