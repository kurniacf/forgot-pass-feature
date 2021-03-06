const express = require("express");
const router = express.Router();

const {insertUser, getUserByEmail, getUserById, updatePassword} = require("../model/user.model");
const {hashPassword, comparePassword} = require("../helpers/bcrypt");
const {createAccessJWT, createRefreshJWT} = require("../helpers/jwt");
const {userAuthor} = require("../middlewares/auth.middleware");
const { setPasswordRestPin, getPinByEmailPin, deletePin, updateDBPin } = require("../model/restPin.model");
const { emailProcessor } = require("../helpers/email");
const { resetPassReqValidation, updatePassReqValidation } = require("../middlewares/formValidation.middleware");
//const { ResetPinSchema } = require("../model/restPin.schema");

router.all("/", (req, res, next)=>{
    //res.json({message: "form user router"});
    next();
});

// Get User Profile Router
router.get("/", userAuthor, async (req, res)=>{
    const _id = req.userId;
    const userProof = await getUserById(_id)
    res.json({user: userProof});
})

// Create New User
router.post("/", async(req, res)=>{
    const {email, password} = req.body;
    try {
        // hash password
        const hashedPass = await hashPassword(password);
        const newUserObj = {
            email, 
            password: hashedPass,
        };
        const result = await insertUser(newUserObj);
        console.log(result);
        res.json({message: "New User Created", result});
    } catch (error) {
        console.log(error);
        res.json({status: "Error", message: error.message});
    }
});

// User Sign In Router
router.post("/login", async (req, res)=>{
    console.log(req.body);
    const {email, password} = req.body;
    // get user with email
    if(!email || !password){
        return res.json({status: "Error", message: "Invalid"})
    }

    const user = await getUserByEmail(email);

    const passFromDb = user && user._id ? user.password : null;

    if (!passFromDb) {
		return res.json({ status: "Error", message: "Invalid email or password!" });
    }
    const result = await comparePassword(password, passFromDb);

    if(!result){
        return res.json({status: "Error", message: "Invalid!"});
    }

    const accessJWT = await createAccessJWT(user.email, `${user._id}`);
    const refreshJWT = await createRefreshJWT(user.email, `${user._id}`);

    res.json({
        status: "Success", 
        message: "Login Successfully!",
        accessJWT,
        refreshJWT
    });
});

router.post("/reset-password", resetPassReqValidation, async (req, res)=>{
    const {email} = req.body;

    const user = await getUserByEmail(email);
    if(user && user._id){
        //ResetPinSchema.remove({"email" : email});
        const setPin = await setPasswordRestPin(email);
        //const setEmail = await setPasswordRestPin(email);

        await emailProcessor({
            email,
            pin: setPin.pin,
            type: "request-new-password",
        });

        
        //console.log(test);
        // ResetPinSchema.findOneAndUpdate(
        //     { email },
        //     {
        //         $set: {pin: setPin.pin},
        //     },
        //     { new: true }
        // )
        // await ResetPinSchema.findOneAndUpdate({email, pin}, {
        //     new: true
        // });
        //updateDBPin(email, setPin.pin);
        
        $sendPin = setPin.pin;

        return res.json({
            status: "Success", 
            message: `If the email is exist in our database, the password reset pin will be sent shortly`,
            $sendPin
        });
        
    }
    return res.json({
        status: "Error", 
        message: "If the email is exist in our database, the password reset pin will be sent shortly"
    });
});

router.patch("/reset-password", updatePassReqValidation, async (req, res)=>{
    const {email, pin, newPassword} = req.body;

    const getPin = await getPinByEmailPin(email, pin);
    if(getPin?._id){
        const dbDate = getPin.addedAt
        const expiresIn = 1;
		let expDate = dbDate.setDate(dbDate.getDate() + expiresIn);
		const today = new Date();

        if (today > expDate) {
			return res.json({ status: "Error", message: "Invalid or expired pin." });
		}

        // encrypt password
        const hashedPass = await hashPassword(newPassword);
        const user = await updatePassword(email, hashedPass)
    
        if(user._id){

            // send email notification
            await emailProcessor({
                email,
                type: "update-password-success",
            });

            // delete pin from db
            deletePin(email, pin);
            //ResetPinSchema.findOneAndDelete({"email" : email});

            return res.json({
				status: "success",
				message: "Your password has been updated",
			});
        }
    
    }
    res.json({
		status: "error",
		message: "Unable to update your password. plz try again later",
	});
});

module.exports = router;