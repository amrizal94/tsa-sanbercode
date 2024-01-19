import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { config } from 'dotenv';
import router from './router.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// app middleware
app.use(morgan('tiny'));
app.use(cors());

//for parsing application/json
app.use(express.json());

// for parsing form-encode
app.use(express.urlencoded({ extended: true }));

// app environment
config();

// app port settings
const port = process.env.PORT || 8080;

// app static folder
app.use(express.static('public'))

/** routes */
app.use(router);

// test rest api
app.get('/', (req, res) => {
  try {
    res.json("Get Request");
  } catch (error) {
    console.log(error);
  }
});

// app run
app.listen(port, () => {
  console.log(`server connected to http://localhost:${port}`);
});
