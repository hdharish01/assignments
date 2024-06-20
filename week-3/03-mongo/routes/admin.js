const { Router, response } = require("express");
const { Admin, Course } = require("../db")
const adminMiddleware = require("../middleware/admin");
const userMiddleware = require("../middleware/user");
const router = Router();

// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    username = req.body.username;
    password = req.body.password;
    await Admin.create({
        username: username,
        password: password
    })
    res.json({
        msg: "admin created successfully"
    })
});

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const imageLink = req.body.imageLink;
    const newCourse = await Course.create({
        title: title,
        description: description,
        price: price,
        imageLink: imageLink
    })
    res.json({
        message: 'Course created successfully',
        courseId: newCourse._id
    })
});

router.get('/courses', adminMiddleware,async (req, res) => {
    // Implement fetching all courses logic
    const response = await Course.find({})
    res.json({
        courses: response
    })
    //u can also do this using .then
    //Course.find({}).then((response)=>{res.json({courses: response})})
});

module.exports = router;