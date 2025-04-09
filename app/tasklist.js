import Taskitem from './taskitem';
import { useState, useEffect } from 'react';

// the list of tasks
export default function Tasklist({deleteTask, editTask, fetchData, tasks}){
    // call fetch data only once when tasklist is called
    useEffect(() => {
        fetchData();
    }, [])

    // no tasks
    if(!tasks.length){
        return <div className="relative text-center text-black">No tasks available</div>;
    }
    // maps each task into a <li> to be displayed accordingly in the <ul>
    const task_list = tasks.map(task => 
        <Taskitem key={task.id} task={task} deleteTask={deleteTask} editTask={editTask}/>
        );
    return (
        <div className="relative w-2/6 bg-gray-200 p-2 overflow-y-auto m-3">
            <ul>
                {task_list}
            </ul>
        </div>
    );
  }
  