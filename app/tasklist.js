import Taskitem from './taskitem';
import { useState, useEffect } from 'react';

// the list of tasks
export default function Tasklist({deleteTask, fetchData, tasks}){
    // call fetch data only once when tasklist is called
    useEffect(() => {
        fetchData();
    }, [])

    // no tasks
    if(!tasks.length){
        return <div className="relative text-center">No tasks available</div>;
    }
    // maps each task into a <li> to be displayed accordingly in the <ul>
    const task_list = tasks.map(task => 
        <Taskitem key={task.id} task={task} deleteTask={deleteTask}/>
        );
    return (
        <div className="relative mt-3 bg-gray-200 p-2 overflow-y-auto max-h-[45vh]">
            <ul className="w-full">
                {task_list}
            </ul>
        </div>
    );
  }
  