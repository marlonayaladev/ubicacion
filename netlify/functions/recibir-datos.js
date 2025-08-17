// netlify/functions/recibir-datos.js
const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Método no permitido'
    };
  }

  const { lat, lon, id } = JSON.parse(event.body);

  const ubicacion = `ID: ${id}, Latitud: ${lat}, Longitud: ${lon}, Fecha: ${new Date().toISOString()}\n`;

  // Define la ruta del archivo de texto
  const filePath = path.join('/tmp', 'ubicaciones.txt');

  try {
    // Agrega los datos al archivo de texto
    fs.appendFileSync(filePath, ubicacion);

    return {
      statusCode: 200,
      body: JSON.stringify({ mensaje: 'Datos recibidos y guardados con éxito' })
    };
  } catch (error) {
    console.error('Error al guardar datos:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ mensaje: 'Error interno del servidor' })
    };
  }
};