// modal/dialogue that shows up when you want to add a task
import Link from 'next/link';
// import { useRouter } from 'next/router';

export default function Task({visible, onClose, editTask, deleteTask, task}){
    // const router = useRouter();

    // display when pressed on, refreshes when visible boolean is updated
    if(!visible){
        return null;
    }
    console.log(task)

    let time = task.time;
    const hours = Math.floor(time/3600) || 0;
    time = time - (hours * 3600);
    const minutes = Math.floor(time/60) || 0;
    time = time - (minutes * 60);
    const seconds = Math.floor(time);

    function handleDelete(){
        deleteTask(task.id);
        onClose();
    }

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
    
        const new_task = {
            id: task.id,
            name: task_name,
            desc: task_desc,
            time: time_in_seconds
        };
        editTask(new_task);
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-25 text-black backdrop-blur-sm flex justify-center items-center z-50">
            <div className="w-[600px] flex flex-col">
                <div className="relative mt-5 top-1/2 bg-gray-200 p-10 shadow-xl">
                    <h2 className="text-center text-xl font-bold mb-2">Modify task</h2>
                    <form action={handleForm} className="flex flex-col gap-3 mb-16"> 
                        <div className="flex flex-col">
                            <label className="text-slate-800">Title</label>
                            <input className="hover:bg-slate-200 p-2 m-3 border-slate-200 bg-slate-100 rounded focus:shadow-outline" type="text" name="name" defaultValue={task.title} placeholder="What do you need to do?" required/>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-slate-800">Description</label>
                            <textarea className="hover:bg-slate-200 p-2 m-3 border-slate-200 bg-slate-100 rounded focus:shadow-outline h-20" type="text" placeholder="Write more about" name="desc" defaultValue={task.description} required/>
                        </div>
                        <div className="flex flex-row justify-between mb-3 w-[575px]"> 
                            <div className="flex flex-col">
                                <label className="text-slate-800 text-s">Hours</label>
                                <input className="hover:bg-slate-200 p-2 mt-3 rm-2 w-2/3 border-slate-200 bg-slate-100 rounded focus:shadow-outline" type="text" name="hours" defaultValue={hours} placeholder="0"/>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-slate-800 text-s">Minutes</label>
                                <input className="hover:bg-slate-200 p-2 mt-3 rm-2 w-2/3 border-slate-200 bg-slate-100 rounded focus:shadow-outline" type="text" name="minutes" defaultValue={minutes} placeholder="0"/>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-slate-800 text-s">Seconds</label>
                                <input className="hover:bg-slate-200 p-2 mt-3 rm-2 w-2/3 border-slate-200 bg-slate-100 rounded focus:shadow-outline" type="text" name="seconds" defaultValue={seconds} placeholder="0"/>
                            </div>
                        </div>
                        {/* timer feature not working for now -> countdown circle is outdated */}
                        {/* <div className="flex justify-center -mb-4">
                            <Link 
                                href={{pathname: '/timer',
                                    query: {taskid : task.id}}}
                                className="text-sm text-slate-500 hover:text-slate-800 underline"
                            >
                                Start Task
                            </Link>
                        </div> */}
                        <div className="flex justify-between items-center w-full absolute bottom-0 left-0 right-0">
                            <button 
                                className="w-1/3 px-4 py-6 bg-blue-400 text-sm text-white hover:bg-blue-600 transition-colors h-full"
                                type="submit"
                            >
                                Edit Task
                            </button>
                            <button 
                                className="w-1/3 px-4 py-6 bg-red-400 text-sm text-white hover:bg-red-600 transition-colors h-full"
                                onClick={handleDelete}
                                type="submit"
                            >
                                Delete Task
                            </button>
                            <button 
                                data-modal-hide="default-modal"                                
                                type="submit"
                                className="w-1/3 px-4 py-6 bg-gray-400 text-sm text-white hover:bg-gray-600 transition-colors h-full"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                        </div>
                    </form> 
                </div>
            </div>
        </div>
    )
}