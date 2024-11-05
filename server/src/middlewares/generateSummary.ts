import { NextFunction, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
<<<<<<< HEAD

export const generateSummary = asyncHandler(async(req:any, res:Response, next:NextFunction)=>{
    console.log("requested generateSummary");
    
    req.summary = "this is summary"
    next()
=======
// import { pipeline } from "@xenova/transformers";
import path from "path";
import { ApiError } from "../utils/apiError";
import axios from "axios";

// const modelPath = path.join(__dirname, '../../../ai/summaryModel');

// let summarizer:any = null

// const loadSummaryModel = async()=>{
//     try {
//         console.log("Loading sumnmarization model....");
//         const transformers =await import('@xenova/transformers')
//         summarizer = await transformers.pipeline('summarization',modelPath)
//         console.log("Model Loaded successfully!");
//         return summarizer
        
//     } catch (error) {
//         console.error("Error Loading model: ",error)
//         return null
//     }
// }
// /* Summary model is loaded */
// loadSummaryModel()

export const generateSummary = asyncHandler(async(req:any, res:Response, next:NextFunction)=>{

    try {
        const {conversation} = req.body

        if(!conversation){
           throw new ApiError(402,"Missing conversation in the body!")
        }

        if(!conversation.trim()){
            throw new ApiError(402,"Conversation is empty!")
        }

        // if(!summarizer){
        //    throw new ApiError(500,"Something went wrong while loading the summary model!")
        // }

        // const maxChunkSize = 500
        // const chunks =[]
        //  /* Divides the conversation into chunks */
        // for (let index = 0; index < conversation.length; index+=maxChunkSize) {
        //    chunks.push(conversation.slice(index,index+maxChunkSize))
        // }

        // /*Summarizes each chunk */
        // const summaries = await Promise.all(
        //     chunks.map(async(chunk)=>{
        //         const result = await summarizer(chunk,{
        //             max_length: 130,
        //             min_length: 30,
        //         })
        //         return result[0].summary_text
        //     })
        // )

        // /*Adds each chunks summary */
        // const finalSummary = summaries.join(' ')

        // console.log("Summary: ", finalSummary);
        
        console.log("Request sent!")
        const response = await axios({
            method:'post',
            url:process.env.FLASK_API_URL,
            headers:{
                'Content-Type':'application/json'
            },
            data:{
                conversation:conversation
            }
        })

        // console.log("Response: ", response.data );
        
        req.summary = response.data.summary
        next()

    } catch (error) {
        console.error("Error processing summary:", error);
        throw new ApiError(500,"Something went wrong while generating summary!")
    }

>>>>>>> f4ce336776e9278cb28642f97307e0881e8bddf5
})
