"use client"

import { useState } from "react";
import Tasklist from "./tasklist.js"
import Modal from "../components/Modal.js"
import AI_chat from "../components/AI_chat.js"
import PocketBase from 'pocketbase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'

// pocket base DB api endpoint
const pb = new PocketBase('http://127.0.0.1:8090');

// home page with tasks
export default function Page(){
  const [taskModalVisibility, setTaskModalVisibility] = useState(false);
  const [AIModalVisibility, setAIModalVisibility] = useState(false);

  // toggle modal visibility when task is added
  function toggleTaskModalVisibility(){
    setTaskModalVisibility(!taskModalVisibility);
  }

  function toggleAIModalVisibility(){
    setAIModalVisibility(!AIModalVisibility);
  }


  // list of tasks
  const [tasks, setTasks] = useState([]);
  // fetch tasks from DB endpoint
  async function fetchData() {
      try{
          const records = await pb.collection('Tasks').getFullList({
          sort: '-created',
          });

          setTasks(records);
      } catch (error) {
          console.log(error.isAbort);
      }
  }

  // add task function passed onto modal
  async function addTask(task){
    const record = await pb.collection("Tasks").create({
      title: task.name,
      description: task.desc,
      time: task.time
    })
    fetchData();
  }

  function onClose(){
    if(AIModalVisibility){
      toggleAIModalVisibility
    }
    if(taskModalVisibility){
      toggleTaskModalVisibility
    }
  }

  // delete task function passed onto tasklist
  async function deleteTask(id){
    const record = await pb.collection('Tasks').delete(id);
    fetchData();
  }

    // calculate time in seconds given the fields to get time in seconds, and add data to DB
  function handleForm(data){
        const task_name = data.get("name");
        const task_desc = data.get("desc");
        
        const hours = parseInt(data.get("hours")) || 0;
        const minutes = parseInt(data.get("minutes")) || 0;
        const seconds = parseInt(data.get("seconds")) || 0;
        let time_in_seconds = (hours * 3600) + (minutes * 60) + seconds;

        if(time_in_seconds <= 0){
            // out of range
            alert("Your task must take at least one second!!!")
            return;
        }
        if(time_in_seconds > 36000){
            alert("Your task must not exceed 10 hours, otherwise split it into different tasks!")
            return;
        }

        const task = {
            name: task_name,
            desc: task_desc,
            time: time_in_seconds
        };
        addTask(task);
        onClose();
  }


  // main page html
  return (
    <div className="flex flex-col justify-center h-screen items-center">
      <div className="fixed top-1/4 bg-gray-200 p-10 shadow-xl text-box-div">
        <h1 className="text-3xl font-bold text-center mb-4 text-slate-700">Task Manager</h1>
        <p className="text-slate-500 text-center">Productivity application used to manage workload</p>
      </div>
      <div className="w-3/5 flex flex-col fixed top-1/2 bg-gray-200 justify-center items-center task-list-div">
        {/* add task button: + icon */}
        <button className="block absolute top-0 left-0 m-2 text-slate-700 bg-gray-200"  onClick={toggleAIModalVisibility} type="button">
        <FontAwesomeIcon icon={faWandMagicSparkles} className="hover:text-slate-400"/>
        </button>
        <button className="block absolute top-0 right-0 m-2 text-slate-700 bg-gray-200"  onClick={toggleTaskModalVisibility} type="button">
          <FontAwesomeIcon icon={faPlus} size="lg" className="hover:text-slate-400"/> 
        </button>
        {/* tasklist div */}
        <div className="m-3 w-full mt-5"> 
          <Tasklist deleteTask = {deleteTask} fetchData = {fetchData} tasks={tasks}/>
        </div>
      </div>
      <Modal visible={taskModalVisibility} onClose={toggleTaskModalVisibility} addTask={handleForm}/>
      <AI_chat visible={AIModalVisibility} onClose={toggleAIModalVisibility} addTask={handleForm}/>

    </div>
  );
}
