const Role = require('../models/roleModel');
const User = require('../models/userModel');

// create a new role and save menu in array

exports.createRole = async (req, res) => {
    try {
        const { name, menus } = req.body;
        const newRole = new Role({ name, menus });
        // check if role already exists
        const roleExists = await Role.findOne({ name });
        if (roleExists) {
            return res.status(400).json({ message: 'Role already exists' });
        }
      const savedRole = await newRole.save();
      res.status(201).json(savedRole);
    } catch (err) {
      // Handle validation or other errors
     console.log(err);
    }
  };

  // list role with pagination page and per_page_record

    exports.getRoles = async (req, res) => {
        try {
            const page = parseInt(req.query.page);
            const per_page_record = parseInt(req.query.per_page_record);
            const skipIndex = (page - 1) * per_page_record;
            const roles = await Role.find().limit(per_page_record).skip(skipIndex);
            res.status(200).json(roles);
        } catch (err) {
            console.log(err);
        }
    }

    // assign role to user

    exports.assignRole = async (req, res) => {
        try {
            const { role, userId } = req.body;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            user.role = role;
            await user.save();
            res.status(200).json({ message: 'Role assigned successfully',  data: user });
        }
        catch (err) {
            console.log(err);
        }
    }