const sequelize = require('./config/database');
const Photo = require('./models/photo.model');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a DB establecida');
    
    await Photo.sync({ force: true });
    console.log('Tabla macro_photos creada');
    
    // Datos de prueba
    await Photo.bulkCreate([
      {
        title: "Ejemplo 1",
        photographer: "Fotógrafo A",
        camera_model: "Modelo X",
        tags: ["naturaleza", "macro"]
      }
    ]);
    
    console.log('Datos de prueba insertados');
    process.exit(0);
  } catch (error) {
    console.error('Error inicializando DB:', error);
    process.exit(1);
  }
})();