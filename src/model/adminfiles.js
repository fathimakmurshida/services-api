const mongoose = require('mongoose')
const Schema = mongoose.Schema    //schema definition

const AdminFileStoreSchema = new Schema({
    login_id: { type: Schema.Types.ObjectId, ref: "login_tb", required: true },
    stage:{type:String},
    rate:{type:Number},
    stage_Description:{type:String},
    filename: { type:String},
    total_amount:{type:Number},

})

var AdminFileStoreData = mongoose.model('adminfilestore_tb', AdminFileStoreSchema) //model creation
module.exports = AdminFileStoreData;
