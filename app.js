const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const apiRouter = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Routes
app.use('/api', apiRouter); 

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});