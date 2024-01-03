import express from "express"


const router = express.Router()


router.post("/", (req,res)=>{
    res.send("Welcome")
})


export default router