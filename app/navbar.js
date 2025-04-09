"use client"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'
import Modal from './components/Modal.js';
import AI_chat from './components/AI_chat.js';


export default function Navbar({handleForm, taskModalVisibility, toggleTaskModalVisibility, AIModalVisibility, toggleAIModalVisibility}){
        


    return (
        <nav className="fixed top-0 flex flex-row w-full px-3 py-5 bg-slate-700 text-white items-center justify-center gap-3">
            <button className="block top-0 left-0 m-2 text-white" type="button">
                <FontAwesomeIcon icon={faWandMagicSparkles} size="lg" className="hover:text-slate-400" onClick={toggleAIModalVisibility}/>
            </button>
            <a className="text-3xl hover:text-slate-400" href="/"> Task Manager</a>
            <button className="block top-0 right-0 m-2 text-white" type="button" onClick={toggleTaskModalVisibility}>
                <FontAwesomeIcon icon={faPlus} size="xl" className="hover:text-slate-400"/> 
            </button>
        <Modal visible={taskModalVisibility} onClose={toggleTaskModalVisibility} addTask={handleForm}/>
        <AI_chat visible={AIModalVisibility} onClose={toggleAIModalVisibility} addTask={handleForm}/>
        </nav>
        

    );
  }
  