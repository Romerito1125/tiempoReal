import express from 'express';
import cors from 'cors';
import busRoutes from './routes/busRouters';
import 'dotenv/config';
import { iniciarCanalesRealtime } from './services/realTime';
import simulationRoutes from './routes/simulationRoutes';
import llegadasRouter from "./routes/llegadasRouter";
import rutasRouter from './routes/rutasRouter'; // ajusta la ruta según tu estructura
import viajeRouter from "./routes/viajeRouter";
import estacionesRouter from "./routes/estacionesRouter";

const app = express();

app.use(cors());
app.use(express.json());

app.use('/rutas', rutasRouter);
app.use('/api', busRoutes);
app.use('/sim', simulationRoutes);
app.use('/info', llegadasRouter);
app.use("/viajes", viajeRouter);
app.use("/estaciones", estacionesRouter);



// Puerto
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Backend en http://localhost:${PORT}`);
  iniciarCanalesRealtime(); 

});
