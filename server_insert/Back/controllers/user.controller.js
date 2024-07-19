const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const {validationEmail, validationPassword} = require('../validators/validation');
const {generateSign} = require('../jwt/jwt');



const register = async(req, res, next) => {
    try {

        const newUser = new User(req.body.user);

        if(!validationEmail(newUser.email)){
            res.status(400).send({code:400, message:'Invalid Email'})
            return next();
        }
        if(!(newUser.password)){
            res.status(400).send({code:400, message:'Invalid password'})
            return next();
        }

        const users = await User.find({email:newUser.email})
        if(users.length > 0){
            res.status(400).send({code:400, message:'Duplicated Email'})
            return next();
        }
        newUser.password = bcrypt.hashSync(newUser.password, 10);
        const createdUser = await newUser.save();
        return res.status(200).json(createdUser);
    } catch (error) {
        return res.status(500).json("prooobando" +error);
    }
}

const login = async(req, res, next) => {

    const data = req.body.user;
 
     try {
         const user = await User.findOne({email: data.email}).populate("pets favPets inProcessPets");
 
         if(user==null){
             console.log("usuario no encontrado");
             return res.status(500).json({"errCode":503,"error": "usuario no encontrado"});
         }
 
         if(bcrypt.compareSync(data.password, user.password)){
             console.log('mi usuario',user);
             var token = null;
             try{
                  token = generateSign(user._id, user.email);
             }catch (errSign)
             {
                 console.log('errSign',errSign);
             }
 
             console.log('este es el token', token);
             return res.status(200).json({user, token});
         }else{
             res.status(400).send({code:400, message:'Password Error'})
             return next()
         }
     } catch (error) {
         return res.status(500).json(error);
     }
 }


const checkSession =(req, res, next) => {
    console.log(req.headers.authorization)
    try {
        return res.status(200).json(req.user)
    } catch (error) {
        return res.status(500).json(error) ;
    }
};

const getUserById = async(req, res) => {
    try {
        const {id} = req.params;
        const myUser = await User.findById(id);
        if (myUser) {
            return res.status(200).json(myUser)
        } else {
            return res.status(404).json('Any user with that id');
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

const postFav = async(req, res, next) => {
    try {
        const user = new User (req.body)

        console.log("new fav", user);
        const updatedUser = await User.findByIdAndUpdate(user._id, user, {new: true}).populate("pets favPets inProcessPets");
        console.log("new favorites", user);

        res.status(201).json(updatedUser)
    } catch (error) {
        return res.status(500).json(error);
    }
}

const postAdoption = async(req, res, next) => {
    try {
        const user = new User (req.body)

        console.log("new adoption", user);
        const updatedUser = await User.findByIdAndUpdate(user._id, user, {new: true}).populate("pets favPets inProcessPets");
        console.log("new favorites", user);

        res.status(201).json(updatedUser)
    } catch (error) {
        return res.status(500).json(error);
    }
}


module.exports = {
    register,
    login,
    checkSession,
    postFav,
    postAdoption,
    getUserById
}
