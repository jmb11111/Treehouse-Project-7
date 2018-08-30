const express = require('express');

const app = express();
app.use(express.static('public'))
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('layout');
});

app.get('/hello', (req, res) => {
    res.render('hello');
});
app.get('/home', (req, res) => {
    res.render('home');
});


app.listen(3000, () => {
    console.log('The application is running on localhost:3000!')
});