import {useState} from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from "motion/react"
import Task from './components/Task';

// each task item <li>
export default function Taskitem({editTask, task, deleteTask}){
    // when hovered boolean
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    // toggle isHovered
    function mouseEnter(){
        setIsHovered(true);
    }

    function mouseLeave(){
        setIsHovered(false);
    }

    function openTask(){
        setIsClicked(true);
    }

    function closeTask(){
        setIsClicked(false);
    }



    
    let time = task.time;
    const hours = Math.floor(time/3600) || 0;
    time = time - (hours * 3600);
    const minutes = Math.floor(time/60) || 0;
    time = time - (minutes * 60);
    const seconds = Math.floor(time);

    // displaying the time remaining on the task in the top left corner
    // function displayTime(){
    //     let time = task.time;
    //     const hours = Math.floor(time/3600) || 0;
    //     time = time - (hours * 3600);
    //     const minutes = Math.floor(time/60) || 0;
    //     time = time - (minutes * 60);
    //     const seconds = Math.floor(time);

    //     return(
    //         <div className="text-[0.6rem] text-slate-600 absolute p-1 top-0 left-0">{hours}H:{minutes}M:{seconds}S left</div>
    //     );

    // }

    const variants = {
        hidden: { opacity: 0, scale : 0 },
        visible: { opacity: 1, scale : 1, transition: { duration: 0.4 } },
      };

    // task list item with buttons to start or delete the task
    return (
        <AnimatePresence>
            <motion.div
                variants = {variants}
                initial="hidden" 
                whileInView="visible"
                // initial={{ opacity: 0, scale : 0 }}
                // animate={{ opacity: 1, scale : 1 }}
                // transition={{
                //     duration: 0.4,
                //     scale: { visualDuration: 0.4 },
                // }}
                // whileHover={isClicked && { scale: 1.02 }}
                key={task.id} 
                className="relative h-[20vh] p-4 border border-slate-500 m-4 hover:bg-slate-300 rounded-3xl shadow-lg"
                onMouseEnter={mouseEnter} 
                onMouseLeave={mouseLeave}
                onClick={openTask}
            >  
            {/* buttons show up when hovering over, depending on isHovered */}
                {/* {isHovered && <button id={task.id} className='text-xs absolute p-2 display-none top-0 right-0 text-slate-500 hover:text-slate-800' onClick={handleDelete}>delete task</button>} 
                {isHovered && <Link id={task.id} className='text-xs absolute p-2 display-none bottom-0 right-0 text-slate-500 hover:text-slate-800' href={{
                    pathname: '/timer',
                    query: {taskid : task.id}, */}
                {/* }}>start task</Link>}  */}
                <div className="flex items-center justify-between">
                    <label className="text-l text-gray-400 p-2">Title</label>
                    <label className="text-[0.7rem] text-gray-400 mt-2">Description</label>
                    <label className="text-l text-gray-400 p-2">Time Left</label>
                </div>
                <div className="justify-between items-center flex mt-4 overflow-y-auto">
                    <h3 className="text-l text-gray-900 p-2">{task.title}</h3>
                    <p className="text-[0.8rem] text-gray-800 mt-1">{task.description}</p>
                    <label className="text-l text-gray-900 p-2">{hours}H:{minutes}M:{seconds}S</label>
                </div>
                <Task visible={isClicked} onClose={closeTask} editTask={editTask} deleteTask={deleteTask} task={task}/>
            </motion.div>
        </AnimatePresence>
    );
  }