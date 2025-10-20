import bcrypt from 'bcrypt';
import { sequelize } from './config/database.js';
import { User } from './models/User.js';

(async () => {
  try {
    // Connessione al DB
    await sequelize.authenticate();
    console.log('Connessione DB riuscita');

    // Sincronizza solo per test (attento: non usare force:true in produzione!)
    await sequelize.sync();

    // Dati di test
    const testUsername = 'testuser';
    const testPassword = 'Password123';
    const testEmail = 'test@example.com';

    // Hash della password
    const hashedPassword = await bcrypt.hash(testPassword, 10);

    // Cancella eventuale utente precedente
    await User.destroy({ where: { username: testUsername } });

    // Crea utente
    const newUser = await User.create({
      username: testUsername,
      email: testEmail,
      password: hashedPassword,
      role: 'user',
    });
    console.log('Utente registrato:', newUser.username);

    // Prova login simulato
    const userFromDB = await User.findOne({ where: { username: testUsername } });
    const isMatch = await bcrypt.compare(testPassword, userFromDB.password);

    console.log('Password corretta?', isMatch); // true se tutto OK

    process.exit(0);
  } catch (error) {
    console.error('Errore test auth:', error);
    process.exit(1);
  }
})();
