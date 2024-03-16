import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.post('/submit', (req, res) => {
    console.log(req.body);
    res.send('Data received');
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});