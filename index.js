import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Conexão com MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Conectado ao MongoDB"))
  .catch(err => console.error("Erro ao conectar:", err));

// Modelo do registro
const RegistroSchema = new mongoose.Schema({
  tipo: String,
  descricao: String,
  dataHora: { type: Date, default: Date.now },
  usuario: String
});

const Registro = mongoose.model('Registro', RegistroSchema);

// Rotas
app.post('/registrar', async (req, res) => {
  const { tipo, descricao, usuario } = req.body;
  const registro = new Registro({ tipo, descricao, usuario });
  await registro.save();
  res.status(201).json(registro);
});

app.get('/relatorios', async (req, res) => {
  const registros = await Registro.find().sort({ dataHora: -1 });
  res.json(registros);
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
