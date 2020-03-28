const express = require('express');
const db = require('./db');
const bodyParser = require('body-parser');

const app = express();

// digunakan utk mem-parsing data dari form
app.use(bodyParser.urlencoded({ extended: true }));

// serve halaman static
app.use(express.static('./public'));

// www.example.com <-- web root
// www.example.com/about <-- untuk halaman about us (tentang kami)

// router
app.get('/', (req, res) => {
    res.send('');
});

app.post('/add-contact', (req, res) => {
    db.addContact(req.body);

    res.redirect('/');
});

app.get('/contact', (req, res) => {
    res.send(db.loadContacts());
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server berhasil jalan di port ${port}`);
});
