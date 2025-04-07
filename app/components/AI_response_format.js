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
        <Carousel key={`subtasks-${subtasks.length}`} showThumbs={false} infiniteLoop>
        {subtasks.map((subtask, index) => (
        <div key={`subtask-${index}`} className="mb-8">
                <div className="flex flex-col h-full h-[22rem]">
                    {hiddenTasks.includes(index) && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-lg">
                            Task added!
                        </div>
                    )}

                    {!hiddenTasks.includes(index) && (<form onSubmit={(e) => {e.preventDefault(); processData(e); hideForm(index)}} className="flex flex-col gap-3 "> 
                        <div className="flex flex-col">
                            <label className="text-slate-800">Title</label>
                            <input className="hover:bg-slate-200 p-2 m-3 border-slate-200 bg-slate-100 rounded focus:shadow-outline" type="text" name="name"  defaultValue={subtask.title} required/>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-slate-800">Description</label>
                            <textarea className="hover:bg-slate-200 p-2 m-3 border-slate-200 bg-slate-100 rounded focus:shadow-outline h-20" type="text"  defaultValue={subtask.description} name="desc" required/>
                        </div>
                        <div className="flex flex-row justify-between mb-3 w-[575px]"> 
                            <div className="flex flex-col items-center justify-center">
                                <label className="text-slate-800 text-s">Hours</label>
                                <input className="hover:bg-slate-200 p-2 mt-3 rm-2 w-2/3 border-slate-200 bg-slate-100 rounded focus:shadow-outline" type="text" name="hours" defaultValue={subtask.hours}/>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <label className="text-slate-800 text-s">Minutes</label>
                                <input className="hover:bg-slate-200 p-2 mt-3 rm-2 w-2/3 border-slate-200 bg-slate-100 rounded focus:shadow-outline" type="text" name="minutes" defaultValue={subtask.minutes}/>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <label className="text-slate-800 text-s">Seconds</label>
                                <input className="hover:bg-slate-200 p-2 mt-3 rm-2 w-2/3 border-slate-200 bg-slate-100 rounded focus:shadow-outline" type="text" name="seconds" defaultValue={subtask.seconds}/>
                            </div>
                        </div>
                        <div className="flex flex-row justify-center ">
                            <button className="mr-5" type="submit">Add Task</button>
                        </div>
                    </form>)}
                </div>
            </div>
            ))}
        </Carousel>

    )
  }
  