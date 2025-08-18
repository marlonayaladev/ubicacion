const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

//archivos de carpeta principal
app.use(express.static(path.join(__dirname, '..')));

const dataFilePath = path.join(__dirname, 'ubicaciones.json');

//endpoint -> ubicaciones
app.post('/api/ubicacion', (req, res) => {
    const { lat, lon } = req.body;
    const timestamp = new Date().toISOString();

    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        let ubicaciones = [];
        let nextId = 1;

        if (!err && data) {
            try {
                ubicaciones = JSON.parse(data);
                //id con orden
                if (ubicaciones.length > 0) {
                    const lastLocation = ubicaciones[ubicaciones.length - 1];
                    nextId = parseInt(lastLocation.id) + 1;
                }
            } catch (e) {
                console.error('Error al parsear el archivo JSON:', e);
            }
        }
        
        // Crea la nueva ubicación con el ID secuencial
        const nuevaUbicacion = { id: nextId.toString(), lat, lon, timestamp };
        ubicaciones.push(nuevaUbicacion);

        // Imprime los datos en la consola para verlos en los logs de Render
        console.log(`Nueva ubicación recibida con ID secuencial:`, nuevaUbicacion);

        fs.writeFile(dataFilePath, JSON.stringify(ubicaciones, null, 2), (err) => {
            if (err) {
                return res.status(500).send({ message: 'Error al guardar la ubicación.' });
            }
            res.status(200).send({ message: 'Ubicación recibida con éxito.' });
        });
    });
});


app.get('/api/ubicaciones', (req, res) => {
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(200).send([]);
        }
        try {
            res.status(200).send(JSON.parse(data));
        } catch (e) {
            res.status(500).send({ message: 'Error al leer las ubicaciones' });
        }
    });
});


app.delete('/api/ubicacion/:id', (req, res) => {
    const locationId = req.params.id;
    fs.readFile(dataFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send({ message: 'Error al leer el archivo.' });
        }
        let ubicaciones = [];
        try {
            ubicaciones = JSON.parse(data);
        } catch (e) {
            return res.status(500).send({ message: 'Error al parsear el archivo JSON.' });
        }

        const ubicacionesFiltradas = ubicaciones.filter(loc => loc.id !== locationId);

        fs.writeFile(dataFilePath, JSON.stringify(ubicacionesFiltradas, null, 2), (err) => {
            if (err) {
                return res.status(500).send({ message: 'Error al borrar la ubicación.' });
            }
            res.status(200).send({ message: 'Ubicación borrada con éxito.' });
        });
    });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
