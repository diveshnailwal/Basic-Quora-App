const express = require("express");
let app = express();
const PORT = process.env.PORT || 3000;
const {v4:uuidv4}=require('uuid');


const path = require("path");
let posts = [
    { id:uuidv4(),username: "divesh", content: "Titanic was awesome!" },
    { id:uuidv4(),username: "aryansh", content: "I love to play bandminton!" },
    { id:uuidv4(),username: "abhinav", content: "Code is life!" }
];

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

app.use(express.urlencoded({ extended: true }));

// Set up view engine and views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Route to display all posts
app.get("/posts", (req, res) => {
    res.render("index", { posts });
});

// Route to display the form to add a new post
app.get("/posts/new", (req, res) => {
    res.render("form");
});
app.get("/posts/:id", (req, res) => {
    let {id}=req.params;
    let post=posts.find((p)=>id===p.id)
    res.render("show",{post});
});

// Route to handle form submission and add a new post
app.post("/posts", (req, res) => {
    let { username, content } = req.body;
    posts.push({ id: uuidv4(), username, content }); // Add a unique id here
    res.redirect("/posts"); // Redirect to show updated posts
   
});
app.delete("/posts/:id", (req, res) => {
    const { id } = req.params;
    posts = posts.filter(post => post.id !== id); // Remove the post with the matching ID
    res.redirect("/posts"); // Redirect back to the posts list
});
app.get("/posts/:id/edit", (req, res) => {
    const { id } = req.params;
    const post = posts.find(post => post.id === id);
    res.render("edit", { post });
});
app.put("/posts/:id", (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    // Find the post by id and update the content
    const post = posts.find(post => post.id === id);
    if (post) {
        post.content = content;
    }

    res.redirect("/posts"); // Redirect to the posts list after updating
});

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});
