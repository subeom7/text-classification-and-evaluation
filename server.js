const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

//Sets up GET request
app.get('/api', (req, res) => {
  const data = { message: 'Hello from the server!' };
  //send a JSON response back to the client
  res.json(data);
});

app.listen(5001, () => {
  console.log('Server is listening on port 5001');
});

