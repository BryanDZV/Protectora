const Forms = require('../models/forms.model');
//---------------------------------INPUT---------------------------------

const getForm = async(req, res) => {
    try {        
        const allForms = await Forms.find();
       
        res.status(200).json(allForms);
        
    } catch (error) {
        return res.status(500).json(error);
    }
};

const getFormById = async(req, res) => {
    try {
        const {id} = req.params;
        const myform = await Forms.findById(id);
        return res.status(200).json(myform)
    } catch (error) {
        return res.status(500).json(error);
    }

};

const postForm = async (req,res) => {
    try {
        const newForm = req.body;
        console.log("new form",newForm);
        const newforms = new Forms(newForm);
        console.log("new formos",newforms);
        
        const inserted = await newforms.save();
        res.status(201).json(inserted)
    } catch (error) {
        return res.status(500).json(error);
    }
};


const putForm = async(req, res) => {
    try {
        const {id} = req.params;
        const putNewForm = new Forms(req.body);
        putNewForm._id = id;
        const updatedForm = await Forms.findByIdAndUpdate(id, putNewForm, {new: true});
        return res.status(200).json(updatedForm);
    } catch (error) {
        return res.status(500).json(error);
    }
}
const deleteForm = async(req, res) => {
    try {
        const {id} = req.params;
        const deletedForm = await Forms.findByIdAndDelete(id);
        return res.status(200).json(deletedForm);
    } catch (error) {
        return res.status(500).json(error);
    }
};
module.exports = {
    getForm,
    getFormById,
    postForm,
    putForm,
    deleteForm,
}