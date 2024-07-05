const express = require('express');
const axios = require('axios');
const path = require('path');
const { env } = require('process');

const app = express();
const PORT = process.env.PORT || 3000;
const USER_AGENT = process.env.USER_AGENT

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/genres', async (req, res) => {
  try {
    const response = await axios.get('https://api.discogs.com/artists/346702', {
      headers: { 
        // 'Authorization': `Discogs token=${DISCOGS_API_KEY}`,
        'User-Agent': USER_AGENT 
      }
    });
    const genres = response.data;
    console.log(genres, "hey");
    // const options = genres.map(genre => `<option value="${genre.id}">${genre.name}</option>`).join('');
    // res.send(`<option value="">--Choose a Genre--</option>${options}`);
  } catch (error) {
    res.status(500).send('Error fetching genres');
  }
});

app.get('/subgenres', async (req, res) => {
  const genreId = req.query.genre;
  try {
    const response = await axios.get(`https://api.discogs.com/genres/${genreId}/subgenres`, {
        headers: { 
          'User-Agent': USER_AGENT 
        }
    });
    const subgenres = response.data.subgenres;
    const options = subgenres.map(subgenre => `<option value="${subgenre.id}">${subgenre.name}</option>`).join('');
    res.send(`<option value="">--Choose a Subgenre/Artist--</option>${options}`);
  } catch (error) {
    res.status(500).send('Error fetching subgenres/artists');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
