const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const dataFilePath = path.join(__dirname, 'data.json');
dotenv.config();

// Middleware untuk parsing body dalam format JSON
app.use(express.json());
app.use(cors());

// Routes
app.get('/users', (req, res) => {
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    let users = [];
    if (data) {
      users = JSON.parse(data);
      if (!Array.isArray(users)) {
        users = [];
      }
    }

    res.json(users);
  });
});

app.post('/users', (req, res) => {
  const { namaDepan, namaBelakang, email, ttl, kota } = req.body;

  if (!namaDepan || !namaBelakang || !email || !ttl || !kota) {
    res.status(400).send('Missing required fields');
    return;
  }

  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    let users = [];
    if (data) {
      users = JSON.parse(data);
      if (!Array.isArray(users)) {
        users = [];
      }
    }

    const newUser = {
      id: users.length + 1,
      namaDepan,
      namaBelakang,
      email,
      ttl,
      kota,
    };
    users.push(newUser);

    fs.writeFile('data.json', JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }

      res.json(newUser);
    });
  });
});

app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { namaDepan, namaBelakang, email, ttl, kota } = req.body;

  if (!namaDepan || !namaBelakang || !email || !ttl || !kota) {
    res.status(400).send('Missing required fields');
    return;
  }

  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    let users = [];
    if (data) {
      users = JSON.parse(data);
      if (!Array.isArray(users)) {
        users = [];
      }
    }

    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      res.status(404).send('User not found');
      return;
    }

    const updatedUser = {
      id,
      namaDepan,
      namaBelakang,
      email,
      ttl,
      kota,
    };
    users[userIndex] = updatedUser;

    fs.writeFile('data.json', JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }

      res.json(updatedUser);
    });
  });
});

app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
      return;
    }

    let users = [];
    if (data) {
      users = JSON.parse(data);
      if (!Array.isArray(users)) {
        users = [];
      }
    }

    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      res.status(404).send('User not found');
      return;
    }

    const deletedUser = users[userIndex];
    users.splice(userIndex, 1);

    fs.writeFile('data.json', JSON.stringify(users, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
        return;
      }

      res.json(deletedUser);
    });
  });
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});
