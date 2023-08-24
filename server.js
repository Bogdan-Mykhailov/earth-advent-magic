import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

import { app } from './app.js';


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server use port ${PORT}`);
});
