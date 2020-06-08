const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//mongoose-currency is used when the cost field is needed
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const promotionSchema = new Schema ({
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
    cost: {
        type: Currency,
        required: true,
        min: 0
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
const Promotion = mongoose.model('Promotion', promotionSchema);
//exports the module
module.exports = Promotion;
