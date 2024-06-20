const { Router } = require("express");
const { User, Course } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const router = Router();
const userMiddleware = require("../middleware/user");

// User Routes
router.post('/signup',async (req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;
    await User.create({
        username: username,
        password: password
    })
    res.json({
        message: 'User created successfully'
    })
});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;
    const user = await User.findOne({
        username: username
    });
    if(user){
        const token = jwt.sign({
            username: username
        },JWT_SECRET);
        res.json({
            token: token
        });
    }else{
        res.status(403).json({
            msg: "user does not exist"
        });
    }

});

router.get('/courses',async (req, res) => {
    // Implement listing all courses logic
    const courses = await Course.find({});
    res.json({
        courses: courses
    })
});

router.post('/courses/:courseId', userMiddleware,async (req, res) => {
    // Implement course purchase logic
    const username = req.username;
    const courseId = req.params.courseId;
    await User.updateOne({
        username: username
    },{
        "$push":{
            purchasedCourses: courseId
        }
    });
    res.json({
        message: 'Course purchased successfully'
    });
});

router.get('/purchasedCourses', userMiddleware,async (req, res) => {
    // Implement fetching purchased courses logic
    const username = req.username;
    const user = await User.findOne({
        username: username
    });
    const courses = await Course.findOne({
        _id:{
            "$in":user.purchasedCourses
        }
    });
    res.json({
        courses: courses
    });
});

module.exports = router