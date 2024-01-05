import mongoose from "mongoose";


let otp_schema = new mongoose.Schema({
    owner: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    otp: {type: String, required: true}
}, {methods: {
    getIsExpired:  function(currentTime: Date){
        if(currentTime.getMonth() === this.createdAt.getMonth() && currentTime.getDay() === this.createdAt.getDay()){
            if(currentTime.getHours() - this.createdAt.getHours() > 1 ){
                    return false
            }
        }
        return this.createdAt > currentTime
    }
}})


let Otp_model = mongoose.model("otps", otp_schema)
export default Otp_model