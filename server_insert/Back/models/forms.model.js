const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const formSchema = mongoose.Schema(
    {
        name: {type: String, required:true},
        email: {type: String, required:true},
        telf: {type:Number,required: true},
        dni: {type: String, required:true},
        direction: {type: String, required:true},
        postal: {type: Number, required:true},
        city: {type: String, required:true},
        conditions: {type: Boolean, required:true},
        pets: {type: String, required:true},
        which: {type: String, required:true},
        petfrienly: {type: String, required:true},
        needs: {type: String, required:true},
        expenses: {type: String, required:true},
        food: {type: String, required:true},
        home: {type: String, required:true},
        rental: {type: String, required:true},
        casero: {type: String, required:true},
        removal: {type: String, required:true},
        garden: {type: String, required:true},
        family: {type: String, required:true},
        agreement: {type: String, required:true},
        visit: {type: String, required:true},
        
    },
    {timestamps:true}
);


const form = mongoose.model('form',formSchema);

module.exports = form;