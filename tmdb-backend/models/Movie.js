import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { User } from './User.js'; // importa il modello User

export const Movie = sequelize.define(
  'Movie',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {               // collega il film all'utente
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tmdb_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    genre: { 
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
    director: { 
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
    poster_path: { 
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: 'movies',
    timestamps: true,
    underscored: true
  }
);

// Relazione tra Movie e User
Movie.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Movie, { foreignKey: 'userId' });
