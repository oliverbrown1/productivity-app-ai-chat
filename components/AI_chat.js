import TextareaAutosize from 'react-textarea-autosize';
import React, { useState } from "react";
import { createCipheriv } from 'crypto';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 

export default function AI_chat({visible, onClose, addTask}){

    const [queryValue, setQueryValue] = useState("");
    const [chatMessages, setChatMessages] = useState([])
    const [subtasks, setSubtasks] = useState([]);

    const saveQuery = (e) => {
        setQueryValue(e.target.value);
    };
    // display when pressed on, refreshes when visible boolean is updated
    if(!visible){
        return null;
    }


    const handleInputChange = (index, field, value) => {
        setSubtasks((prevSubtasks) =>
            prevSubtasks.map((subtask, i) =>
                i === index ? { ...subtask, [field]: value } : subtask
            )
        );
    };

    async function parseResponse(response){
        const split_index = response.indexOf("[");
        if(split_index == -1){
            const subtasks = []
            const response_text = response
            console.log(response)
            return { response_text, subtasks};
        }
        const response_text = response.slice(0, split_index).trim();
        const subtasks_text = response.slice(split_index).trim();
        if(!response_text){
            throw new Error("No Response text found in response");
        }
        if (!subtasks_text) {
            throw new Error("No JSON found in the response.");
        }

        try {
            const subtasks = JSON.parse(subtasks_text);
            return { response_text, subtasks };
        } catch (error) {
            throw new Error("Failed to parse JSON subtasks.");
        }
    }
    

    // calculate 
    async function handleForm(){
    
        const handleInputChange = (e) => {
            e.target.value = e.target.value;

        };

        var query = queryValue

        const queryDiv = (
            <div>
                {query}
            </div>
        );

        // var AI_response = getAIResponse(query)
        setChatMessages((prev) => [
            ...prev,
            {type: "user", div: queryDiv}
        ]);

        // onClose();
        var response = ""
        console.log(query)
        try{
            const records = await fetch("/api/query",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    "input" : query
                })
            })

            response = await records.json()
            console.log(response)
            // we can use regex to identify the json format we want for the subtasks
            // const subtasks_json = response.match(/\[\s*{.*?}\s*\]/s);
            // if (!subtasks_json) {
            //     throw new Error("No JSON found in the response.");
            // }

            // subtasks_string = subtasks_json[0]

        
            // setChatMessages((prev) => [
            //     ...prev,
            //     {type: "AI", text: response}
            // ]);
  
        } catch (error) {
            console.log(error);
        }
        
        var response_text = ""
        var subtasks = []
        try{
            ({ response_text, subtasks } = await parseResponse(response));
        }
        catch(error){
            console.log(error)
        }

        setSubtasks(subtasks);

        const response_div = (
            <div>
                {response_text}
            </div>
        );
        setChatMessages((prev) => [
            ...prev,
            {type: "AI", div: response_div}
        ]);

        if(subtasks.length > 0){
            const subtasks_div = (
                <Carousel key={`subtasks-${subtasks.length}`} showThumbs={false} infiniteLoop>
                    {subtasks.map((subtask, index) => (
                    <div key={`subtask-${index}`} className="mb-8">
                        <div className="flex flex-col">
                            <form action={addTask} className="flex flex-col gap-3"> 
                                <div className="flex flex-col">
                                <label className="text-slate-800">Title</label>
                                <input className="hover:bg-slate-200 p-2 m-3 border-slate-200 bg-slate-100 rounded focus:shadow-outline" type="text" name="name" onChange={(e) =>handleInputChange(index, "title", e.target.value)} value={subtask.title} required/>
                                </div>
                                <div className="flex flex-col">
                                <label className="text-slate-800">Description</label>
                                <textarea className="hover:bg-slate-200 p-2 m-3 border-slate-200 bg-slate-100 rounded focus:shadow-outline h-20" type="text" onChange={(e) =>handleInputChange(index, "desc", e.target.value)}  value={subtask.description} name="desc" required/>
                                </div>
                                <div className="flex flex-row justify-between mb-3 w-[575px]"> 
                                    <div className="flex flex-col items-center justify-center">
                                        <label className="text-slate-800 text-s">Hours</label>
                                        <input className="hover:bg-slate-200 p-2 mt-3 rm-2 w-2/3 border-slate-200 bg-slate-100 rounded focus:shadow-outline" type="text" name="hours" onChange={(e) =>handleInputChange(index, "hours", e.target.value)}  value={subtask.hours}/>
                                    </div>
                                    <div className="flex flex-col items-center justify-center">
                                        <label className="text-slate-800 text-s">Minutes</label>
                                        <input className="hover:bg-slate-200 p-2 mt-3 rm-2 w-2/3 border-slate-200 bg-slate-100 rounded focus:shadow-outline" type="text" name="minutes" onChange={(e) =>handleInputChange(index, "minutes", e.target.value)}  value={subtask.minutes}/>
                                    </div>
                                    <div className="flex flex-col items-center justify-center">
                                        <label className="text-slate-800 text-s">Seconds</label>
                                        <input className="hover:bg-slate-200 p-2 mt-3 rm-2 w-2/3 border-slate-200 bg-slate-100 rounded focus:shadow-outline" type="text" name="seconds" onChange={(e) =>handleInputChange(index, "seconds", e.target.value)}  value={subtask.seconds}/>
                                    </div>
                                </div>
                                <div className="flex flex-row justify-center ">
                                    <button className="mr-5" type="submit">Add Task</button>
                                </div>
                            </form> 
                        </div>
                    </div>
                    ))}
                </Carousel>
                // <div key={`subtasks-${subtasks.length}`}>
                //     {subtasks.map((subtask, index) => (
                //     <div className='mb-2'>
                //         <div className="flex flex-col">
                //                 <h2 className="text-center text-xl mb-2">Create new task</h2>
                //                 <form className="flex flex-col gap-3"> 
                //                     <div className="flex flex-col">
                //                     <label className="text-slate-800">Title</label>
                //                     <input className="hover:bg-slate-200 p-2 m-3 border-slate-200 bg-slate-100 rounded focus:shadow-outline" type="text" name="name" value={subtask.title} required/>
                //                     </div>
                //                     <div className="flex flex-col">
                //                     <label className="text-slate-800">Description</label>
                //                     <textarea className="hover:bg-slate-200 p-2 m-3 border-slate-200 bg-slate-100 rounded focus:shadow-outline h-20" type="text" value={subtask.description} name="desc" required/>
                //                     </div>
                //                     <div className="flex flex-row justify-between mb-3 w-[575px]"> 
                //                         <div className="flex flex-col">
                //                             <label className="text-slate-800 text-s">Hours</label>
                //                             <input className="hover:bg-slate-200 p-2 mt-3 rm-2 w-2/3 border-slate-200 bg-slate-100 rounded focus:shadow-outline" type="text" name="hours" value={subtask.hours}/>
                //                         </div>
                //                         <div className="flex flex-col">
                //                             <label className="text-slate-800 text-s">Minutes</label>
                //                             <input className="hover:bg-slate-200 p-2 mt-3 rm-2 w-2/3 border-slate-200 bg-slate-100 rounded focus:shadow-outline" type="text" name="minutes" value={subtask.minutes}/>
                //                         </div>
                //                         <div className="flex flex-col">
                //                             <label className="text-slate-800 text-s">Seconds</label>
                //                             <input className="hover:bg-slate-200 p-2 mt-3 rm-2 w-2/3 border-slate-200 bg-slate-100 rounded focus:shadow-outline" type="text" name="seconds" value={subtask.seconds}/>
                //                         </div>
                //                     </div>
                //                     <div className="flex flex-row justify-center ">
                //                         <button className="mr-5" type="submit">Review Task</button>
                //                     </div>
                //                 </form> 
                //             </div>
                //     </div>
                //     ))}
                // </div>
            );

            setChatMessages((prev) => [
                ...prev,
                {type: "AI", div: subtasks_div}
            ]);
        }


    }

    if (!chatMessages.length){
        const messages = <div></div>
    }


    const messages = chatMessages.map((message, index) => 
        <div 
        key={index}
        className={`p-3 m-1 w-1/2 text-sm bg-white rounded-lg ${
        message.type === "user"
            ? "self-end text-end"
            : "self-start text-start"
        }`}>{message.div}</div>


        // const client = new HfInference("hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");

        // const chatCompletion = await client.chatCompletion({
        //     model: "meta-llama/Llama-3.3-70B-Instruct",
        //     messages: [
        //         {
        //             role: "user",
        //             content: "What is the capital of France?"
        //         }
        //     ],
        //     max_tokens: 500
        // });

        // console.log(chatCompletion.choices[0].message);
    );
    
    // form to create new task in modal
    return (
        <div className="fixed inset-0 top-[50px] bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center m-10">
            <div className="w-full h-full flex flex-col justify-center items-center">
                <div className="relative bg-gray-200 p-10 shadow-xl w-full h-full flex flex-col">
                    <div className="flex-grow flex flex-col gap-3 bg-slate-100 rounded border-slate-200 overflow-y-auto p-4">
                        {/* chat container */}
                        {messages}
                    </div>
                    <form 
                        action={handleForm} 
                        className="bg-white flex items-center w-full mt-4 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <TextareaAutosize 
                            onChange={saveQuery} 
                            maxRows={6} 
                            className="flex-grow w-full border-none resize-none focus:outline-none"/>
                        <button className="ml-3" type="submit">Chat</button>
                    </form>
                    <button 
                        data-modal-hide="default-modal" 
                        type="button" 
                        onClick={onClose} 
                        className="mt-4 self-center bg-gray-300 hover:bg-gray-400 rounded px-4 py-2">
                        Cancel
                    </button>
                </div>
            </div>
        </div>

    )
  }
  