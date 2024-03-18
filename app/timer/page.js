'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import { useState } from "react";
import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

export default function Page({searchParams}){
// timer component and page for user to complete tasks
    const [timerStarted, setTimerStarted] = useState(false);
    const [taskCompleted, setTaskCompleted] = useState(false);
    const [taskData, setTaskData] = useState([])
    const [timeLeft, setTimeLeft] = useState(0)
    const [backgroundColour, setBackgroundColour] = useState("col flex-col fixed w-full h-full top-1/5 bg-gray-800 opacity-90 backdrop-blur-sm flex justify-center items-center transition-colors duration-800 ease-in-out");

    // get task data from given id in URL search parameters
    async function getTaskData(taskid){
        const record = await pb.collection('Tasks').getOne(taskid);
        setTaskData(record);
    }

    // use effect hook to do this only once on page loadup (not on refresh)
    const taskid = searchParams.taskid;
    useEffect(() => {
        getTaskData(taskid);
    }, []);

    // function to display the remaining time
    // displays the largest unit if possible i.e. display hour time if an hour is left, otherwise minute etc.
    // calculates time in hours/minutes/seconds
    // refreshes every second
    const renderTime = ({ remainingTime }) => {
        setTimeLeft(remainingTime);
        const hour = 3600;
        const minute = 60;
        let shown_time = 0;
        let time_unit = ""
        if(remainingTime >= hour){
           shown_time = Math.floor(remainingTime/hour);
           time_unit = "Hours";
        }
        else if(remainingTime >= minute){
            shown_time = Math.floor(remainingTime/minute);
            time_unit = "Minutes";
        }
        else{
            shown_time = Math.floor(remainingTime);
            time_unit = "Seconds";
        }
        return (
        <div className="flex flex-col items-center">
            <div className="text text-slate-400 text-2xl">{time_unit}</div>
            <div className="text text-slate-200 text-xl">{shown_time}</div>
            <div className="text text-slate-400 text-2xl">Remaining</div>
        </div>
        );
    };

    // transition background and start time
    function startTimer(){
        setBackgroundColour("col flex-col fixed w-full h-full top-1/5 bg-slate-900 opacity-90 backdrop-blur-sm flex justify-center items-center transition-colors duration-300 ease-in-out");
        setTimerStarted(true);
    }

    // transition background and stop time 
    function stopTimer(){
        setBackgroundColour("col flex-col fixed w-full h-full top-1/5 bg-gray-800 opacity-90 backdrop-blur-sm flex justify-center items-center transition-colors duration-300 ease-in-out");
        setTimerStarted(false);
    }

    // when user goes back, update the task with the current time remaining on the task
    async function updateTask(){
        const data = {
            "title": taskData.title,
            "description": taskData.description,
            "time": timeLeft
        };
        const record = await pb.collection('Tasks').update(taskData.id, data);
    }

    // set task as completed - show completion screen
    function finishTask(){
        setTaskCompleted(true);
    }

    // delete a task from the DB
    async function deleteTask(){
        const record = await pb.collection('Tasks').delete(taskData.id);
    }

    // timer interface
    return (
             <div className={backgroundColour}>
                {/* displayed when task is incomplete */}
                {!taskCompleted && (<>
                    <h1 className="text-slate-200 text-2xl mb-5">{taskData.title}</h1>
                    {/* imported timer from library */}
                    <CountdownCircleTimer
                        isPlaying={timerStarted}
                        duration={taskData.time}
                        size={300}
                        trailColor={"#0f172a"}
                        colors={["#306844", "#F7B801", "#F28500", "#A30000","#002366"]}
                        colorsTime={[(taskData.time), (3*taskData.time/4), (taskData.time/2), (taskData.time/4), (taskData.time/999)]}
                        onComplete={() => {
                            stopTimer(); // Call the stopTimer function when the timer is completed
                            finishTask() // Call the updateTask function when the timer is completed
                            return { shouldRepeat: false }; // Stop the timer from repeating
                        }}
                    >
                        {renderTime}
                    </CountdownCircleTimer>

                    {/* buttons to start, stop timer and go back */}
                    <div className="relative row flex-row mt-7 m-3"> 
                        <button className="text-slate-400 text-l mr-5 hover:text-slate-500" onClick={startTimer} >Start Timer</button>
                        <button className="text-slate-400 text-l hover:text-slate-500" onClick={stopTimer}>Stop Timer</button>
                    </div> 
                    <div className="relative m-2"> 
                        <Link className="text-slate-300 text hover:text-slate-500" onClick={updateTask} href="/">Go Back</Link>
                    </div>
                </>)}
                {/* completion screen */}
                {taskCompleted && (<>
                    <div className="text-4xl text-slate-200">Task completed!</div> 
                    <div className="text-1xl text-slate-400 mb-5">Take a well deserved break</div> 
                    <Link className="text-slate-300" onClick={deleteTask} href="/">Finish task</Link>          
                </>)}   
            </div>
    );
}
