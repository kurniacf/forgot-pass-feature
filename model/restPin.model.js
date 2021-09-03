//const { token } = require("morgan");
const { ResetPinSchema } = require("./restPin.Schema");

const { randomPinNumber } = require("../utils/randomGenerator");
const { getUserByEmail } = require("./user.model");

const setPasswordRestPin = async (email) => {
    //reand 4 digit
    const pinLength = 4;
    const randPin = await randomPinNumber(pinLength);

    const emailOld = getUserByEmail(email);

    const restObj = {
        email,
        pin: randPin,
    };

    return new Promise((resolve, reject) => {
        ResetPinSchema(restObj)
        .save()
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    });
};

const getPinByEmailPin = (email, pin)=>{
    return new Promise((resolve, reject)=>{
        try {
            ResetPinSchema.findOne({email, pin}, (error, data)=>{
                if(error){
                    console.log(error);
                    resolve(false);
                }
                resolve(data);
            })
        } catch (error) {
            reject(error);
            console.log(error)
        }
    });
};

const deletePin = (email, pin)=>{
    try {
        ResetPinSchema.findOneAndDelete({email, pin}, (error, data)=>{
            if(error){
                console.log(error);
            }
        });
    } catch (error) {
        console.log(error)
    }
};

let updateDBPin =  (email, pin)=>{
    try {
        ResetPinSchema.findOneAndUpdate(email, pin, {
            new: true
        });
    } catch (error) {
        console.log(error)
    }
};

module.exports = {
    setPasswordRestPin,
    getPinByEmailPin,
    deletePin,
    updateDBPin
};