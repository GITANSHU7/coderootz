const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
        message: 'Name field is required',
        unique: true
    },
    menus: [{ type: String }],
   
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);