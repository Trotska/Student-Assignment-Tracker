
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
//Generate jwt token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register user
const registerUser = async (req, res) => {
    //Get variables for request body
    const { name, email, password } = req.body;

    try {
        //Find user with a given email
        const userExists = await User.findOne({ email });
        //if user exists return a confirmation message
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        //if user doesnt exist create one
        const user = await User.create({ name, email, password });
        
        //respond with an object containing ID, name, email and a generate token
        res.status(201).json({ id: user.id, name: user.name, email: user.email, token: generateToken(user.id) });
    } catch (error) {
        //Error message
        res.status(500).json({ message: error.message });
    }
};

//Login user function
const loginUser = async (req, res) => {
    //get email/password from req body
    const { email, password } = req.body;
    try {
        //find user with a given email
        const user = await User.findOne({ email });
        //if user and password match respond with a object containign user details.
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({ id: user.id, name: user.name, email: user.email, token: generateToken(user.id) });
        } else {
            
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        //error message
        res.status(500).json({ message: error.message });
    }
};

//Get profile
const getProfile = async (req, res) => {
    try {
      //find user with a given ID
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      // respond with profile data
      res.status(200).json({
        name: user.name,
        email: user.email,
        university: user.university,
        address: user.address,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };

//update user profile function
const updateUserProfile = async (req, res) => {
    try {
        //find user with a given ID from req body
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        //load variables with given req data
        const { name, email, university, address } = req.body;
        
        //verify updated data
        user.name = name || user.name;
        user.email = email || user.email;
        user.university = university || user.university;
        user.address = address || user.address;

        //save data
        const updatedUser = await user.save();
        res.json({ id: updatedUser.id, name: updatedUser.name, email: updatedUser.email, university: updatedUser.university, address: updatedUser.address, token: generateToken(updatedUser.id) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, updateUserProfile, getProfile };
