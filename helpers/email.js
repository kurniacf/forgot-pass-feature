const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "devxportee@gmail.com",
        pass: "xporteedev098",
    },
});

const send = (info)=>{
    return new Promise(async (resolve, reject)=>{
        try {
            let result = await transporter.sendMail(info);
            console.log("Message sent: %s", result.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(result));
            resolve(result);
        
        } catch (error) {
            console.log(error);
        }
    })

}

const emailProcessor = async({email, pin, type})=>{
    let info = "";
    switch (type) {
        case "request-new-password":
            info = {
                from: '"devxportee@gmail.com', // sender address
                to: email, // list of receivers
                subject: "Password Reset", // Subject line
                text: `Here is your pin <b>${pin}</b>`, // plain text body
                html: `Here is your pin <b>${pin}</b>`, // html body
            };
            send(info);
            break;
        case "update-password-success":
            info = {
                from: '"devxportee@gmail.com', // sender address
                to: email, // list of receivers
                subject: "Password Update", // Subject line
                text: `Your password has been Update`, // plain text body
                html: `</b>Your password has been Update</b>`, // html body
            };
            send(info);
            break;
        default:
            break;
    }


    
    
}


module.exports = {emailProcessor}