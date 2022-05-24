const mongoose = require('mongoose');
const Schema = mongoose.Schema    //schema definition

const fileSchema = new Schema(
  {
    // login_id: { type: Schema.Types.ObjectId, ref: "login_tb", required: true },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    file_path: {
      type: String,
      required: true
    },
    file_mimetype: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const File = mongoose.model('File', fileSchema);

module.exports = File;