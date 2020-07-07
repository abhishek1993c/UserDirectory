const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');

const User = require('../../models/User');

//  @route      POST api/users/create
//  @desc       Create new User
//  @access     Public
router.post(
  '/create',
  [
    check('name', 'Name is mandatory').not().notEmpty(),
    check('email', 'Please enter valid email address').isEmail(),
    check('phoneNumber', 'Invalid Phone Number').isLength({ min: 8, max: 10 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let falseErr = false;
      console.log(errors);
      console.log(errors.array());
      errors.array().forEach((e) => {
        if (e.param == 'phoneNumber' && e.value == '') {
          falseErr = true;
        }
      });
      if (!falseErr) return res.status(400).json({ errors: errors.array() });
    }

    let { name, email, gender, phoneNumber, department, location } = req.body;
    gender = gender.toLocaleUpperCase();
    try {
      //check user
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      user = new User({
        name,
        email,
        gender,
        phoneNumber,
        department,
        location,
      });

      await user.save();

      res.send('User created');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error!!');
    }
  }
);

//  @route      GET api/users
//  @desc       Get user list
//  @access     Public
router.get('/', async (req, res) => {
  try {
    let userList = [];
    let users = await User.find();
    users.forEach((user) => {
      userList.push({
        name: user.name,
        email: user.email,
        gender: user.gender,
        phoneNumber: user.phoneNumber,
        department: user.department,
        location: user.location,
        createdDate: user.createdDate,
      });
    });
    res.status(200);
    return res.send(userList);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Failed to fetch users');
  }
});

//  @route      POST api/users/update
//  @desc       update User
//  @access     Public
router.post(
  '/update',
  [
    check('name', 'Name is mandatory').not().notEmpty(),
    check('email', 'InValid email').isEmail(),
    check('phoneNumber', 'Invalid Phone Number').isLength({ min: 8, max: 10 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, gender, phoneNumber, department, location } = req.body;

    try {
      //check user
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: [{ msg: 'User does not exists' }] });
      }

      let userObj = {};
      userObj.name = name;
      userObj.email = email;
      userObj.gender = gender.toLocaleUpperCase();
      userObj.phoneNumber = phoneNumber;
      userObj.department = department;
      userObj.location = location;
      userObj.createdDate = Date.now();

      user = await User.findOneAndUpdate(
        { email },
        { $set: userObj },
        { new: true }
      );
      res.send('User Modified');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error!!');
    }
  }
);

//  @route      DELETE api/users
//  @desc       Delete a user
//  @access     Public
router.delete('/', async (req, res) => {
  try {
    await User.findOneAndRemove({ email: req.body.email });
    return res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Failed to delete users');
  }
});

module.exports = router;
