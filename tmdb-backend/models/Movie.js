import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

export const Movie = sequelize.define(
  'Movie',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    tmdb_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    genre: { // rinominato da genres per coerenza
      type: DataTypes.STRING,
      allowNull: true
    },
    runtime: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cast: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    director: { // nuovo campo
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    release_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    poster_path: { // nuovo campo per URL immagine
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: 'movies',
    timestamps: true,
    underscored: true // se vuoi che i campi timestamp siano created_at / updated_at
  }
);
