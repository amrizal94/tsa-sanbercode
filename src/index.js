import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { config } from 'dotenv';

const app = express();

// app middleware
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

// app environment
config();

// app port settings
const port = process.env.PORT || 8080;

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
