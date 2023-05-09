const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    notes.push(req.body);
    fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
      if (err) throw err;
      res.json(req.body);
    });
  });
});

app.delete('/api/notes/:id', (req, res) => {
  fs.readFile('./db/db.json', (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    const newNotes = notes.filter((note) => note.id != req.params.id);
    fs.writeFile('./db/db.json', JSON.stringify(newNotes), (err) => {
      if (err) throw err;
      res.json(req.body);
    });
  });
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});