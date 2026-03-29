import express from 'express';
import path from 'node:path';
import { EnvVar } from './config/EnvVar';
import appRouter from './routes/router';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve a pasta uploads como arquivos estáticos
// Ex: GET /uploads/images/abc123-foto.jpg
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.use('/', appRouter);


app.listen(EnvVar.PORT, () => {console.log(`Server rodando na porta http://localhost:${EnvVar.PORT}`)});