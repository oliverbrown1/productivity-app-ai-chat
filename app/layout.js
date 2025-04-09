"use client"
// import type { Metadata } from "next";
import { Roboto_Slab } from "next/font/google";
import "./globals.css";
import Navbar from "./navbar";
import Main from "./main";
import PocketBase from 'pocketbase';
import { useState } from 'react';

const pb = new PocketBase('http://127.0.0.1:8090');

const roboto = Roboto_Slab({
   weight: '200',
   subsets: ["latin"] 
});


export default function RootLayout({ children }) {
  const [taskModalVisibility, setTaskModalVisibility] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [AIModalVisibility, setAIModalVisibility] = useState(false);

  const toggleTaskModalVisibility = () => {
    console.log("hi");
    setTaskModalVisibility(!taskModalVisibility);
  };

  function toggleAIModalVisibility(){
    console.log("bye")
    setAIModalVisibility(!AIModalVisibility);
  };

  const onClose = () => {
    setTaskModalVisibility(false);
  };

  // const editTask = async (task) => {
  //   console.log(task);
  //   const record = await pb.collection("Tasks").update(task.id, {
  //     title: task.name,
  //     description: task.desc,
  //     time: task.time
  //   });
  //   fetchData();
  // };

  const fetchData = async () => {
    try {
      const records = await pb.collection('Tasks').getFullList({
        sort: '-created',
      });
      setTasks(records);
    } catch (error) {
      console.log(error.isAbort);
    }
  };

  const editTask = async (task) => {
    console.log(task);
    const record = await pb.collection("Tasks").update(task.id, {
      title: task.name,
      description: task.desc,
      time: task.time
    });
    fetchData();
  };

  const addTask = async (task) => {
    console.log(task);
    const record = await pb.collection("Tasks").create({
      title: task.name,
      description: task.desc,
      time: task.time
    });
    fetchData();
  };

  async function deleteTask(id){
    const record = await pb.collection('Tasks').delete(id);
    fetchData();
  }

  const handleForm = (data) => {
    console.log("hi")
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
  };

  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={roboto.className}>
        <Main 
          tasks = {tasks}
          deleteTask = {deleteTask}
          editTask = {editTask}
          fetchData = {fetchData}
        />
        <Navbar 
          handleForm={handleForm} 
          taskModalVisibility={taskModalVisibility} 
          toggleTaskModalVisibility={toggleTaskModalVisibility}
          AIModalVisibility={AIModalVisibility}
          toggleAIModalVisibility={toggleAIModalVisibility}
        />
        {children}
      </body>
    </html>
  );
}
