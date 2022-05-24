const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const fileUploadSchema = new Schema({
    login_id: { type: Schema.Types.ObjectId, ref: "login_tb" },
    imgCollection: {
        type: String
    }
})

module.exports = mongoose.model('fileStorage', fileUploadSchema)