// Import statements
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Initialize dotenv
dotenv.config();

// Create a new Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// testing supabase
const dataDb = await supabase.from('posts').select("*").order('created_at', { ascending: false });

// Create a new Express app
const app = express();
const port = 3000;


async function createPost(post) {
  try {
    // Assuming `post` is an object containing data to be inserted
    const response = await supabase
      .from('posts')
      .insert(post);

    // Extracting data and error from the response object
    const data = response.data;
    const error = response.error;

    return { data, error };
  } catch (error) {
    // Handle any errors that occur during the insertion process
    console.error('Error creating post:', error.message);
    return { error };
  }
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index.ejs', {posts: dataDb.data });
});

app.post('/submit', async (req, res) => {
  try {
      const newPost = {
          title: req.body.postTitle,
          content: req.body.postContent
      };

      const { data, error } = await createPost(newPost);

      if (error) {
          console.error('Error creating post:', error.message);
          // Handle the error appropriately
      }

      res.redirect('/');
  } catch (error) {
      console.error('Error creating post:', error.message);
      // Handle any unexpected errors
      res.status(500).send('Internal Server Error');
  }
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