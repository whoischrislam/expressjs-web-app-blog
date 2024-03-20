import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

const posts = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index.ejs', {posts: posts });
});

app.post('/submit', (req, res) => {
    const newPost = {
      title: req.body.postTitle,
      content: req.body.postContent,
      dateTime: new Date().toLocaleString()
    };
    posts.unshift(newPost);
    res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});