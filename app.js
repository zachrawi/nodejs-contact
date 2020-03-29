const express = require('express');
const db = require('./db');
const bodyParser = require('body-parser');

const app = express();

// digunakan utk mem-parsing data dari form
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

// serve halaman static
app.use(express.static('./public'));

// www.example.com <-- web root
// www.example.com/about <-- untuk halaman about us (tentang kami)

// router
app.get('/', (req, res) => {
    res.send('');
});

app.post('/add-contact', (req, res) => {
    if (req.body.name.trim().length === 0) {
        res.send({
            status: 'error',
            message: 'Name is mandatory'
        });
    } else if (req.body.phone.trim().length === 0) {
        res.send({
            status: 'error',
            message: 'Phone is mandatory'
        });
    } else if (req.body.address.trim().length === 0) {
        res.send({
            status: 'error',
            message: 'Address is mandatory'
        });
    } else {
        let data = db.addContact(req.body);

        res.send({
            status: 'success',
            data: data,
        });
    }
});

app.post('/edit-contact/:id', (req, res) => {
    if (req.body.name.trim().length === 0) {
        res.send({
            status: 'error',
            message: 'Name is mandatory'
        });
    } else if (req.body.phone.trim().length === 0) {
        res.send({
            status: 'error',
            message: 'Phone is mandatory'
        });
    } else if (req.body.address.trim().length === 0) {
        res.send({
            status: 'error',
            message: 'Address is mandatory'
        });
    } else {
        const result = db.editContact(req.params.id, req.body);

        if (result) {
            res.send({
                status: 'success',
                data: result
            });
        } else {
            res.send({
                status: 'error',
                message: 'Contact is not found'
            });
        }
    }
});

app.get('/delete/:id', (req, res) => {
    const id = req.params.id;

    const result = db.deleteContact(id);

    if (result) {
        res.send({
            status: 'success'
        });
    } else {
        res.send({
            status: 'error',
            message: 'Contact is not found'
        });
    }
});

app.get('/contact', (req, res) => {
    res.send(db.loadContacts());
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server berhasil jalan di port ${port}`);
});
