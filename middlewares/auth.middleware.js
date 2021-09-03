const {verifyAccessJWT} = require("../helpers/jwt");
//const {getJWT} = require("../helpers/redis");

const userAuthor = (req, res, next) =>{
    const {authorization} = req.headers;
    console.log(authorization);
    
    // verify jwt valid
    const decoded = verifyAccessJWT(authorization);
    console.log(decoded);
    if(decoded.email){
        //const userId = await getJWT(authorization)
        //console.log(userId)
    //     if(!userId){
    //         res.status(403).json({message: "Forbidden"});
    //     }
        return next()
    }
    return res.status(403).json({message: "Forbidden"})
    // check jwt
    // extract user id
    // get user profile

    
    

};

module.exports = {
    userAuthor
};