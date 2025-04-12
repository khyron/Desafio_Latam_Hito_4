const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Photo = sequelize.define('Photo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  photographer: {
    type: DataTypes.STRING,
    allowNull: false
  },
  camera_model: {
    type: DataTypes.STRING
  },
  lens_model: {
    type: DataTypes.STRING
  },
  aperture: {
    type: DataTypes.STRING
  },
  shutter_speed: {
    type: DataTypes.STRING
  },
  iso: {
    type: DataTypes.INTEGER
  },
  focal_length: {
    type: DataTypes.STRING
  },
  magnification: {
    type: DataTypes.STRING
  },
  subject: {
    type: DataTypes.STRING
  },
  location: {
    type: DataTypes.STRING
  },
  date_taken: {
    type: DataTypes.DATE
  },
  description: {
    type: DataTypes.TEXT
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING)
  }
}, {
  tableName: 'macro_photos',
  timestamps: false
});

// Sincroniza el modelo con la base de datos
Photo.sync({ force: true })
  .then(() => console.log('Tabla macro_photos creada'))
  .catch(err => console.error('Error al crear tabla:', err));

module.exports = Photo;
