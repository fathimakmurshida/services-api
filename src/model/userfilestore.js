const mongoose = require('mongoose')
const Schema = mongoose.Schema    //schema definition

const UserFileStoreSchema = new Schema({
    login_id: { type: Schema.Types.ObjectId, ref: "login_tb", required: true },
    
    filename: { type:String, required: true }
    //imagelink:{type:String}
   
})

var UserFileStoreData = mongoose.model('userfilestore_tb', UserFileStoreSchema) //model creation
module.exports = UserFileStoreData;
