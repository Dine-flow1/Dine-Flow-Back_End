import jwt from "jsonwebtoken"
export const authMiddleware = (req,res,next)=>{
    const token  = req.headers.authorization?.split(" ")[1]
    console.log(token);
    
    if(!token){
       return  res.status(401).json({message:"Token Not Provided"})
    }
    try {
        const decoded = jwt.verify(token ,process.env.JWT_SECRET)
        req.user =decoded
        next()
    } catch (error) {
        console.log("AuthMiddlewareError",error)
        return res.status(401).json({message:"Invalid or expired token"})
    }
}
export const authorzeRoles = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({message:"Access denied "})
        }
        next()
    }
}