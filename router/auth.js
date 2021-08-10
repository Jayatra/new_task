const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const { registerValidation , loginValidation } = require('../validation');


router.post('/signup', async (req, res) => {

//lets validate data
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //checking if the user is already in db
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('email already exists');

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (err) {
         res.status(400).send(err);
        console.log(err)
    }
});

//login
router.post('/login',async(req,res)=>{
    //lets validate data
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //checking if the email exists
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Signup first');

    //password is correct
    const validPass =await bcrypt.compare(req.body.password,user.password);
    if(!validPass) return res.status(400).send('password is wrong');

    //creat and assign token
    const token = jwt.sign({_id:user._id},process.env.TOKEN)
    res.header('auth-token',token).send(token)


    res.send('logined successfuly')
})

module.exports = router;