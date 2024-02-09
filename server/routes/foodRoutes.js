const mongoose = require('mongoose');
const FoodModel = require('../models/Food');

module.exports = app => {
app.get('/getFoods', (req, res) => {
    FoodModel.find({}, (err, result) => {
        if (err) {
            res.json(err)
        } else {
            res.json(result) 
        }

    })
});

app.post("/createFood"), async (req, res) => {
    const food = req.body
    const newFood = new FoodModel(food);

// try doing this so data to model changes are all local?
//     const newFood = new FoodModel({
//       title,
//       content,
//       _user: req.user.id
//     });
    
    try {
        await newFood.save();
        res.send(newFood);
  
      } catch (err) {
        res.send(400, err);
      }
}
}

// const mongoose = require('mongoose');
// const requireLogin = require('../middlewares/requireLogin');
// const cleanCache = require('../middlewares/cleanCache')

// const Blog = mongoose.model('Blog');

// module.exports = app => {
//   app.get('/api/blogs/:id', requireLogin, async (req, res) => {
//     const blog = await Blog.findOne({
//       _user: req.user.id,
//       _id: req.params.id
//     });

//     res.send(blog);
//   });

//   app.get('/api/blogs', requireLogin, async (req, res) => {
//     const blogs = await Blog
//     .find({ _user: req.user.id })
//     .cache({ key: req.user.id });

//     res.send(blogs);
//   });

//   app.post('/api/blogs', requireLogin, cleanCache, async (req, res) => {
//     const { title, content } = req.body;



//   });
// };
