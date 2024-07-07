const express = require('express');
const axios = require('axios');
const path = require('path');
const { env } = require('process');

const app = express();
const PORT = process.env.PORT || 3000;
const USER_AGENT = process.env.USER_AGENT

// const artists = [
//     { id: 1, name: 'Radiohead', discogsId: 3840 },
//     { id: 2, name: 'The Beatles', discogsId: 82730 },
//     { id: 3, name: 'Hall and Oates', discogsId: 95886 },
// ];

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/albums', async (req, res) => {
  const artistId = req.query.artist;
  try {
      const response = await axios.get(`https://api.discogs.com/artists/${artistId}/releases`, {
          headers: { 
              'User-Agent': USER_AGENT 
          }
      });
      const albums = response.data.releases.filter(release => release.type === 'master').map(release => ({
          id: release.id,
          title: release.title
      }));
      const options = albums.map(album => `<div class="album">${album.title}</div>`).join('');
      res.send(`<h2>List of albums:</h2>${options}`);
  } catch (error) {
      console.error('Error fetching albums:', error);
      res.status(500).send('Error fetching albums');
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
