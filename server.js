import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const dbPath = './src/serverDatabase.js';

const readDB = async () => {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    const match = data.match(/export const players = (.*);/s);
    if (match) {
      return eval(match[1]);
    }
    return [];
  } catch (error) {
    console.error('Error reading database:', error);
    return [];
  }
};

const writeDB = async (players) => {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    const newData = data.replace(/export const players = (.*);/s, `export const players = ${JSON.stringify(players, null, 2)};`);
    await fs.writeFile(dbPath, newData, 'utf-8');
  } catch (error) {
    console.error('Error writing to database:', error);
  }
};

app.get('/api/players', async (req, res) => {
  const players = await readDB();
  res.json(players);
});

app.put('/api/players/:nickname', async (req, res) => {
  const { nickname } = req.params;
  const updatedFields = req.body; // This now contains only the fields to update
  const players = await readDB();
  const playerIndex = players.findIndex(p => p.nickname.toLowerCase() === nickname.toLowerCase());

  if (playerIndex !== -1) {
    const player = players[playerIndex];

    // Apply updates based on field type
    for (const key in updatedFields) {
      if (Object.prototype.hasOwnProperty.call(updatedFields, key)) {
        // For quantities, add to existing value
        if (['donationCases', 'plexikiCases', 'coinCases', 'titleCases', 'plexiki', 'coins'].includes(key)) {
          player[key] = (player[key] || 0) + updatedFields[key];
        } else {
          // For other fields (like privilege, privilegeDuration), directly assign
          player[key] = updatedFields[key];
        }
      }
    }

    await writeDB(players);
    res.json(players[playerIndex]);
  } else {
    res.status(404).json({ message: 'Player not found' });
  }
});

app.post('/api/purchase-privilege', async (req, res) => {
  const { nickname, privilege, duration } = req.body;

  if (!nickname || !privilege) {
    return res.status(400).json({ message: 'Nickname and privilege are required' });
  }

  const players = await readDB();
  const playerIndex = players.findIndex(p => p.nickname.toLowerCase() === nickname.toLowerCase());

  if (playerIndex !== -1) {
    const player = players[playerIndex];
    player.privilege = privilege.toUpperCase();
    player.privilegeDuration = duration;

    await writeDB(players);
    res.json({ message: `Privilege '${privilege}' purchased for ${nickname}` });
  } else {
    res.status(404).json({ message: 'Player not found' });
  }
});

app.post('/api/purchase-currency', async (req, res) => {
  const { nickname, currencyId, quantity } = req.body;

  if (!nickname || !currencyId || !quantity) {
    return res.status(400).json({ message: 'Nickname, currency ID, and quantity are required' });
  }

  const players = await readDB();
  const playerIndex = players.findIndex(p => p.nickname.toLowerCase() === nickname.toLowerCase());

  if (playerIndex !== -1) {
    const player = players[playerIndex];
    const amount = parseInt(quantity, 10);

    if (currencyId === 'sapphires') {
      player.plexiki = (player.plexiki || 0) + amount;
    } else if (currencyId === 'coins') {
      player.coins = (player.coins || 0) + amount;
    }

    await writeDB(players);
    res.json({ message: `${amount} ${currencyId} purchased for ${nickname}` });
  } else {
    res.status(404).json({ message: 'Player not found' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
