const express = require('express');
const router = express.Router();

// Define route handlers
router.get('/', (req, res) => {
  res.send('API Home');
});

router.get('/users', (req, res) => {
  // Code to fetch and send users data
  const users = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }];
  res.json(users);
});

router.post('/users', (req, res) => {
  // Code to create a new user
  const newUser = req.body; // Assuming body-parser middleware is used
  // Code to save the user
  res.status(201).json(newUser);
});

// Export the router
module.exports = router;