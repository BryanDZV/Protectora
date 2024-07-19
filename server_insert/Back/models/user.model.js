const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = mongoose.Schema(
    {
        name: {type: String, required: false},
        image: {type:'String',required: false},
        email: {type: String, required: true},
        password: {type: String, required: true},
        pets: [{type: Schema.Types.ObjectId, ref: 'Animal'}],
        inProcessPets: [{type: Schema.Types.ObjectId, ref: 'Animal'}],
        favPets: [{type: Schema.Types.ObjectId, ref: 'Animal'}],
        info: [{type: Schema.Types.ObjectId, ref: 'Forms'}, {required: false}],
    },
    {timestamps:true}
);


const User = mongoose.model('user', userSchema);

module.exports = User;