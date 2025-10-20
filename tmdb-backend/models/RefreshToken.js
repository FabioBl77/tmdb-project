import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import { User } from './User.js';

export const RefreshToken = sequelize.define(
  'RefreshToken',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    revoked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  },
  {
    tableName: 'refresh_tokens',
    timestamps: true
  }
);

// Relazione con User
RefreshToken.belongsTo(User, { foreignKey: 'userId' }); // Un token appartiene a un utente
User.hasMany(RefreshToken, { foreignKey: 'userId' }); // un utente può avere più refresh token attivi (utile se l’utente si logga da più dispositivi).
