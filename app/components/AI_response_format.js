import TextareaAutosize from 'react-textarea-autosize';
import React, { useState } from "react";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 

export default function AI_response_format({visible, subtasks, addTask}){

    const [hiddenTasks, setHiddenTasks] = useState([])

    if(!visible){
        return null;
    }

    async function hideForm (index){
        setHiddenTasks((prev) => [
            ...prev,
            index
        ]);

    }

    async function processData(e){
        const form = e.target;
        const data = new FormData(form);
        addTask(data)
    }

    
    // form to create new task in modal
    return (
        <div className="w-full h-full p-4">
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Suggested Tasks</h2>
            <Carousel 
                key={`subtasks-${subtasks.length}`} 
                showThumbs={false} 
                infiniteLoop
                className="w-full"
            >
                {subtasks.map((subtask, index) => (
                    <div 
                        key={`subtask-${index}`} 
                        className="w-full h-full bg-white rounded-xl shadow-lg p-6 border border-slate-200"
                    >
                        {hiddenTasks.includes(index) ? (
                            <div className="flex flex-col items-center justify-center h-full text-green-600">
                                <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <h3 className="text-xl font-semibold mb-2">Task Added!</h3>
                            </div>
                        ) : (
                            <form 
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    processData(e);
                                    hideForm(index);
                                }} 
                                className="flex flex-col gap-4"
                            >
                                <div className="flex flex-col">
                                    <label className="text-slate-800 font-medium mb-1">Title</label>
                                    <input 
                                        className="hover:bg-slate-50 p-3 text-lg bg-slate-200 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full" 
                                        type="text" 
                                        name="name"  
                                        defaultValue={subtask.title} 
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-slate-800 font-medium mb-1">Description</label>
                                    <textarea 
                                        className="hover:bg-slate-50 p-3 text-lg bg-slate-200 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full h-24" 
                                        name="desc" 
                                        defaultValue={subtask.description} 
                                        required
                                    />
                                </div>
                                <div className="flex flex-row justify-between gap-3 w-full">
                                    <div className="flex flex-col items-center justify-center w-1/3">
                                        <label className="text-slate-800 text-sm font-medium">Hours</label>
                                        <input 
                                            className="hover:bg-slate-50 p-3 text-lg bg-slate-200 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full" 
                                            type="text" 
                                            name="hours" 
                                            defaultValue={subtask.hours}
                                        />
                                    </div>
                                    <div className="flex flex-col items-center justify-center w-1/3">
                                        <label className="text-slate-800 text-sm font-medium">Minutes</label>
                                        <input 
                                            className="hover:bg-slate-50 p-3 text-lg bg-slate-200 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full" 
                                            type="text" 
                                            name="minutes" 
                                            defaultValue={subtask.minutes}
                                        />
                                    </div>
                                    <div className="flex flex-col items-center justify-center w-1/3">
                                        <label className="text-slate-800 text-sm font-medium">Seconds</label>
                                        <input 
                                            className="hover:bg-slate-50 p-3 text-lg bg-slate-200 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full" 
                                            type="text" 
                                            name="seconds" 
                                            defaultValue={subtask.seconds}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <button 
                                        type="submit" 
                                        className="p-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium w-1/3"
                                    >
                                        Add Task
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                ))}
            </Carousel>
        </div>
    )
  }