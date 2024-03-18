"use client"

import { useState } from "react";
import Tasklist from "./tasklist.js"
import Modal from "../components/Modal.js"
import PocketBase from 'pocketbase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

// pocket base DB api endpoint
const pb = new PocketBase('http://127.0.0.1:8090');

// home page with tasks
export default function Page(){
  const [modalVisibility, setModalVisibility] = useState(false);

  // toggle modal visibility when task is added
  function toggleModalVisibility(){
    setModalVisibility(!modalVisibility);
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

  // delete task function passed onto tasklist
  async function deleteTask(id){
    const record = await pb.collection('Tasks').delete(id);
    fetchData();
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
        <button className="block absolute top-0 right-0 m-2 text-slate-700 bg-gray-200"  onClick={toggleModalVisibility} type="button">
          <FontAwesomeIcon icon={faPlus} size="lg" className="hover:text-slate-400"/> 
        </button>
        {/* tasklist div */}
        <div className="m-3 w-full mt-5"> 
          <Tasklist deleteTask = {deleteTask} fetchData = {fetchData} tasks={tasks}/>
        </div>
      </div>
      <Modal visible={modalVisibility} onClose={toggleModalVisibility} addTask={addTask}/>
    </div>
  );
}
