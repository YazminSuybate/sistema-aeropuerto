import express from 'express'
const app = express();
app.use(express.json()); //MIDDLEWARE PARA PARSEAR JSON
const PORT = 3000;

app.get('/ping', (_req, res) => {
    console.log('pinged');
    res.send('pong');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});