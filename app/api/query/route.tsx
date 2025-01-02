import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(request:Request){

    console.log("test")
    const r_body = await request.json()
    console.log("test")

    if(!process.env.HUGGING_FACE_API_KEY){
        throw new Error("Missing Hugging Face API key");
        return null
    }

    const query = r_body.input;
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const client = new HfInference(process.env.HUGGING_FACE_API_KEY);
    const system_prompt = 'You are a friendly and helpful assistant that helps users break down tasks into subtasks and add them into the application. '+
    'If the user wants to add a task or break down a problem, suggest 1-5 subtasks (depending on the complexity of the task) that meet the requirements of the task.'+
    'Only suggest subtasks if the user mentions wanting to add or breakdown a task, otherwise respond normally if the question is appropriate. '+
    'If the task can be completed in one task, suggest only one task. Please give you response in the following format: \n'+
    'Very briefly explain, only in a few sentences, how the user can break down their problems, and the sub-tasks that make up the task. '+
    'For each subtask you suggest, please provide:\n'+
    '- A short title for the subtask.\n'+
    '- A brief description explaining what the subtask involves.\n'+
    '- An estimated time, split into hours, minutes and seconds respectively.\n'+
    'Please include a JSON structured format for the subtasks you suggest in an array:\n'+
    '[{"title" : "subtask title", "description": "Brief explanation of the subtask.", "hours": hours required, "minutes" : minutes required, "seconds" : seconds required}]\n'+
    'The JSON structured format should be at the end of your response. Ensure to only include newline characters in your response as well.'

    async function getGroqChatCompletion(query: string) {
        return groq.chat.completions.create({
          messages: [
            {
              role: "user",
              content: query,
            },
            {
                role: "system",
                content: system_prompt
            },
          ],
          model: "llama-3.3-70b-versatile",
          max_tokens: 1000
        });
    }

    const chatCompletion = await getGroqChatCompletion(query);
    console.log(chatCompletion.choices[0]?.message?.content || "");
    const response = JSON.stringify(chatCompletion.choices[0]?.message?.content || "");
    return new Response(response, {
        headers:{
            "Content-Type":"application/json"
        }
    })
    

    // const response = await client.chatCompletion({
    //     model: "meta-llama/Llama-3.3-70B-Instruct",
    //     messages: [
    //         {
    //             role: "user",
    //             content: query
    //         }
    //     ],
    //     max_tokens: 500
    // });
    
    // console.log("hi");
    // console.log(response.choices[0].message);
    // const answer = JSON.stringify(response.choices[0].message)
    // return new Response(null, {
    //     headers:{
    //         "Content-Type":"application/json"
    //     }
    // })
}