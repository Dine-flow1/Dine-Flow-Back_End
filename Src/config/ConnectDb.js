import mongoose  from "mongoose";

 const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGOSE_URL);
        console.log("Db Connected");
        
    } catch (error) {
         console.error(`Db Error : ${error.message}`);
        process.exit(1)
        
        
    }
}
export default connectDB