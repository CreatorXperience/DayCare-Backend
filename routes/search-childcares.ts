import express from "express"
import {child_care_model} from "../models/child-care-profile"

const router =  express.Router()

router.get("/", async(req,res)=>{
    let {q} = req.query

    if(!q){
        return res.status(404).send({message: "query not found"})
    }

    let pipeline = [
        {
            $search: {
                index:  "search-childcares",
                text: {
                    query: q,
                    path: {
                        wildcard: "*"
                    },
                    fuzzy: {}
                }
            }
        }
    ]
    let childcares=  await child_care_model.aggregate(pipeline)
    if(!childcares){
        return  res.status(404).send("no childcares")
    }
    res.send(childcares)
    })

    
    export default router
