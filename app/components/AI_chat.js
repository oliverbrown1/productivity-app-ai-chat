import TextareaAutosize from 'react-textarea-autosize';
import React, { useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import AI_response_format from "./AI_response_format.js"

export default function AI_chat({visible, onClose, addTask}){

    const [queryValue, setQueryValue] = useState("");
    const [chatMessages, setChatMessages] = useState([])

    const saveQuery = (e) => {
        setQueryValue(e.target.value);
    };
    // display when pressed on, refreshes when visible boolean is updated
    if(!visible){
        return null;
    }

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

    async function processTask(data){
        addTask(data)

    }
    

    // calculate 
    async function handleForm(e){
        e.preventDefault()


        var query = queryValue
        setQueryValue("")

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
            const carousel_div = (
                <AI_response_format visible={visible} subtasks={subtasks} addTask={addTask} />
            )

            setChatMessages((prev) => [
                ...prev,
                {type: "AI", div: carousel_div}
            ]);
        }


    }

    if (!chatMessages.length){
        const messages = <div></div>
    }


    const messages = chatMessages.map((message, index) => 
        <div 
        key={index}
        className={`p-3 m-1 max-w-[50%] text-sm bg-white rounded-lg w-fit break-words ${
        message.type === "user"
            ? "self-end text-end"
            : "self-start text-start"
        }`}>{message.div}</div>

    );
    
    // form to create new task in modal
    return (
        <div className="fixed inset-0 top-[50px] bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center m-10">
            <div className="w-full h-full flex flex-col justify-center items-center">
                <div className="relative bg-gray-200 p-10 shadow-xl w-full h-full flex flex-col">
                <h2 className="text-center text-xl mb-2 font-bold text-slate-800">AI Assistant Chat</h2>
                    <div className="flex-grow flex flex-col gap-3 bg-slate-100 rounded border-slate-200 overflow-y-auto p-4">
                        {/* chat container */}
                        {messages}
                    </div>
                    <form 
                        onSubmit={(e) => {handleForm(e); }}
                        className="bg-white flex items-center w-full mt-4 border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <TextareaAutosize 
                            value={queryValue}
                            onChange={saveQuery} 
                            maxRows={6} 
                            className="flex-grow w-full border-none resize-none focus:outline-none"/>
                        <button className="ml-3 p-2 rounded-lg bg-gray-300 hover:bg-gray-400" type="submit">Chat</button>
                    </form>
                    <button 
                        data-modal-hide="default-modal"
                        type="button" 
                        onClick={onClose} 
                        className="mt-4 self-center bg-gray-300 hover:bg-gray-400 rounded px-4 py-2">
                        Close Chat
                    </button>
                </div>
            </div>
        </div>

    )
  }
  