import express from 'express';
import cors from 'cors';
import busRoutes from './routes/busRouters';
import 'dotenv/config';
import { iniciarCanalesRealtime } from './services/realTime';
import simulationRoutes from './routes/simulationRoutes';

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api', busRoutes);
app.use('/sim', simulationRoutes);


// Puerto
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend en http://localhost:${PORT}`);
  iniciarCanalesRealtime(); // Así garantizamos que siempre revise.

});
