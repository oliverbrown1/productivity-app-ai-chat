// modal/dialogue that shows up when you want to add a task
export default function Modal({visible, onClose, addTask}){

    // display when pressed on, refreshes when visible boolean is updated
    if(!visible){
        return null;
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
    
    // form to create new task in modal
    return (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
            <div className="w-[600px] flex flex-col">
                <div className="relative mt-5 top-1/2 bg-gray-200 p-10 shadow-xl">
                    <h2 className="text-center text-xl mb-2">Create new task</h2>
                    <form action={handleForm} className="flex flex-col gap-3"> 
                        <div className="flex flex-col">
                        <label className="text-slate-800">Title</label>
                        <input className="hover:bg-slate-200 p-2 m-3 border-slate-200 bg-slate-100 rounded focus:shadow-outline" type="text" name="name" placeholder="What do you need to do?" required/>
                        </div>
                        <div className="flex flex-col">
                        <label className="text-slate-800">Description</label>
                        <textarea className="hover:bg-slate-200 p-2 m-3 border-slate-200 bg-slate-100 rounded focus:shadow-outline h-20" type="text" placeholder="Write more about" name="desc" required/>
                        </div>
                        <div className="flex flex-row justify-between mb-3 w-[575px]"> 
                            <div className="flex flex-col">
                                <label className="text-slate-800 text-s">Hours</label>
                                <input className="hover:bg-slate-200 p-2 mt-3 rm-2 w-2/3 border-slate-200 bg-slate-100 rounded focus:shadow-outline" type="text" name="hours" placeholder="0"/>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-slate-800 text-s">Minutes</label>
                                <input className="hover:bg-slate-200 p-2 mt-3 rm-2 w-2/3 border-slate-200 bg-slate-100 rounded focus:shadow-outline" type="text" name="minutes" placeholder="0"/>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-slate-800 text-s">Seconds</label>
                                <input className="hover:bg-slate-200 p-2 mt-3 rm-2 w-2/3 border-slate-200 bg-slate-100 rounded focus:shadow-outline" type="text" name="seconds" placeholder="0"/>
                            </div>
                        </div>
                        <div className="flex flex-row justify-center ">
                            <button className="mr-5" type="submit">Add Task</button>
                            <button data-modal-hide="default-modal" type="submit" onClick={onClose}>Cancel</button>
                        </div>
                    </form> 
                </div>
            </div>
        </div>
    )
  }
  