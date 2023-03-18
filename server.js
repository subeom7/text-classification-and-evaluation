const express = require('express');
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5001;

//parse incoming request bodies in JSON format
app.use(bodyParser.json());

app.post('/api/classify', async (req, res) => {
  const savedText = req.body.text;

  try {
    const response = await fetch('http://localhost:5002/classify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: savedText }),
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
