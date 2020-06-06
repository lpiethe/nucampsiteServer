const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const partnerSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true    
    },
    image: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
    },
    description: {
        type: String,
        required: true
    }
 }, {
         //mongoose will automatically add createdAt and updatedAt by having this 'timestamps'
        timestamps: true
});
//model created for this schema
const Partner = mongoose.model('Partner', partnerSchema);
//exports the module
module.exports = Partner;
