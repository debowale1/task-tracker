import { useState, useEffect } from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'


function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks()
      setTasks(tasksFromServer)
    }

    getTasks()
    
  }, [])
  // Fetch Tasks
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()
    return data
  }
  // Fetch Task
  const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()
    return data
  }

  
  // delete task
  const DeleteTask = async(id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE'
    })
    setTasks(tasks.filter(task => task.id !== id))
  }

  //toggle reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id)
    const updatedTask = {
      ...taskToToggle, 
      reminder: !taskToToggle.reminder
    }
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updatedTask)
    })
    const data = await res.json()
    setTasks(tasks.map(task => {
      if(task.id === id){
        return {...task,
        reminder: data.reminder}
      }else{
        return task
      }
      
    }))
  }
  // add new task
  const addTask = async (task) => {
    const res = await fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    })
    const data = await res.json()
    setTasks([...tasks, data])
  }
  return (
    <Router>
      <div className="container">
        <Header showAdd={showAddTask} onAdd={() => setShowAddTask(!showAddTask)} />
        { showAddTask && <AddTask onAdd={addTask} />}
        {tasks.length === 0 ? <p>No Tasks</p> : 
        <Tasks 
        tasks={tasks} 
        onDelete={DeleteTask} 
        onToggle={toggleReminder} 
        />
        }
        <Footer />
      </div>
    </Router>
  );
}

export default App;
