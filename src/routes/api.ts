import express, { Request, Response } from 'express';

const router = express.Router();

// Define route handlers
router.get('/', (req: Request, res: Response) => {
  res.send('API Home');
  res.send('Hello Express!');
  res.sendFile(__dirname+'/index.html')
});

router.get('/users', (req: Request, res: Response) => {
  const users = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
  ];
  res.json(users);
});

router.post('/users', (req: Request, res: Response) => {
  const newUser = req.body as { id: number; name: string }; // Assuming body-parser middleware is used
  // Code to save the user
  res.status(201).json(newUser);
});

// Export the router
export default router;
