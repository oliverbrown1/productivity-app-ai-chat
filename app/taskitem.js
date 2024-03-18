import {useState} from 'react';
import Link from 'next/link';

// each task item <li>
export default function Taskitem({task, deleteTask}){
    // when hovered boolean
    const [isHovered, setIsHovered] = useState(false);

    // toggle isHovered
    function mouseEnter(){
        setIsHovered(true);
    }

    function mouseLeave(){
        setIsHovered(false);
    }

    // deleting a task
    function handleDelete(e){
        const name = e.target.getAttribute("id")
        deleteTask(name)
    }

    // displaying the time remaining on the task in the top left corner
    function displayTime(){
        let time = task.time;
        const hours = Math.floor(time/3600) || 0;
        time = time - (hours * 3600);
        const minutes = Math.floor(time/60) || 0;
        time = time - (minutes * 60);
        const seconds = Math.floor(time);

        return(
            <div className="text-[0.6rem] text-slate-600 absolute p-1 top-0 left-0">{hours}H:{minutes}M:{seconds}S left</div>
        );

    }

    // task list item with buttons to start or delete the task
    return (
        <li key={task.id} className="relative max-h-[30vh] p-4 border border-slate-500 m-4 hover:bg-slate-300"
        onMouseEnter={mouseEnter} onMouseLeave={mouseLeave}>  
        {/* buttons show up when hovering over, depending on isHovered */}
            {isHovered && <button id={task.id} className='text-xs absolute p-2 display-none top-0 right-0 text-slate-500 hover:text-slate-800' onClick={handleDelete}>delete task</button>} 
            {isHovered && <Link id={task.id} className='text-xs absolute p-2 display-none bottom-0 right-0 text-slate-500 hover:text-slate-800' href={{
                pathname: '/timer',
                query: {taskid : task.id},
            }}>start task</Link>} 
            {isHovered && displayTime()}
            {/* task data */}
            <div className="flex items-center justify-between">
                <label className="text-[0.7rem] text-gray-400 mt-2">Title</label>
                <label className="text-[0.7rem] w-3/4 text-gray-400 mt-2">Description</label>
            </div>
            <div className="justify-between items-center flex mt-4 overflow-y-auto">
                <h3 className="text-[0.8rem] text-gray-900 mt-1">{task.title}</h3>
                <p className="text-[0.8rem] text-gray-800 w-3/4 mt-1">{task.description}</p>
            </div>
        </li>
    );
  }
  