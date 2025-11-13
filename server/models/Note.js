   const mongoose = require('mongoose');

   const noteSchema = new mongoose.Schema({
     title: { type: String, required: true },  
     description: { type: String, required: true }, 
     subject: { type: String, required: true },  
     department: { type: String, required: true },  
     filePath: { type: String, required: true },  
     uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  
     uploadDate: { type: Date, default: Date.now }  
   });

   module.exports = mongoose.model('Note', noteSchema); 
   