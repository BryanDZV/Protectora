const validationEmail = (email) => {
    const regex=  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    return regex.test(String(email).toLowerCase());
}

const validationPassword = (password) => {
    const regex= /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$/
    
    return regex.test(String(password));
}

module.exports = {validationEmail, validationPassword};