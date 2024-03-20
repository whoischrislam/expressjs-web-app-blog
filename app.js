// Import statements
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Initialize dotenv
dotenv.config();

// Create a new Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// Create a new Express app
const app = express();
const port = 3000;

let idCount = 1;

const posts = [
  {
    id: 1,
    title: 'Initial Post of my new blog!',
    content: 'I just wanted to share to the world this blog! I hope you like it!',
    dateTime: new Date().toLocaleString()
  }
];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index.ejs', {posts: posts });
});

app.post('/submit', (req, res) => {
    idCount++;
    const newPost = {
      id: idCount,
      title: req.body.postTitle,
      content: req.body.postContent,
      dateTime: new Date().toLocaleString()
    };
    posts.unshift(newPost);
    res.redirect('/');
});

app.post('/delete', (req, res) => {
  const deletePostId = parseInt(req.body.deletePostId);
  const deleteArray = posts.find(element => element.id === deletePostId);
  const indextoDelete = posts.indexOf(deleteArray);
  posts.splice(indextoDelete, 1);
  res.redirect('/');
});

app.post('/edit', (req, res) => {
  // Take request and create a new post in preparation for replacing the old post
  const editPost = {
    id: parseInt(req.body.editPostId),
    title: req.body.editPostTitle,
    content: req.body.editPostContent,
    dateTime: "Edited on " + new Date().toLocaleString()
  };

  // Find the post to edit and replace it with the new post
  const editArray = posts.find(element => element.id === editPost.id);
  const indextoEdit = posts.indexOf(editArray); // Get the index of the post to edit
  posts[indextoEdit] = editPost; // Replace the old post with the new post

  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});