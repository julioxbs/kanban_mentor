import React, { createRef, useRef, useState } from 'react'
import { gql, useMutation, useQuery } from '@apollo/client'
import { Link, useLocation } from 'react-router-dom'
import { CreateTaskForm } from '../components/CreateTaskForm'
import { ViewTask } from '../components/ViewTask'
import { GET_ALL_BOARDS } from '../App'
import { ToggleAsideContext } from '../context/ToggleContext'

export const GET_TASK_BY_ID = gql`
    query ShowBoard($boardid: String!) {
    showBoard(boardid: $boardid) {
        tasks {
        id
        name
        description
        status
        subTasks {
            id
            title
            status
        }
        }
    }
}`

const DELETE_BOARD = gql`
    mutation DeleteBoard($boardid: String!) {
        deleteBoard(boardid: $boardid)
    }
`

interface ITaskList {
    state: {
        name: string
        id: string
        tasks: {}[]
    }
}

interface dataBoard {
    showBoard: {
        tasks: {
            id: string
            name: string
            description: string
            status: string
            subTasks: {}[]
        }[]
        status: string
    }
}

export const TaskList = () => {
    const { state: { name, id } } = useLocation() as ITaskList;
    const [activeCreateTask, setActiveCreateTask] = React.useState(false);
    const { data, refetch } = useQuery<dataBoard>(GET_TASK_BY_ID, { variables: { boardid: id } });
    const board = data?.showBoard;
    const [activeViewTask, setActiveViewTask] = React.useState(false);
    const [currentTask, setCurrentTask] = React.useState<any>();
    const [deleteBoard] = useMutation(DELETE_BOARD);

    const todoTasks = board?.tasks.filter(task => task.status === 'todo');
    const doingTasks = board?.tasks.filter(task => task.status === 'doing');
    const doneTasks = board?.tasks.filter(task => task.status === 'done');

    React.useEffect(() => {
        refetch();
    });

    const handleViewTask = (id: string) => {
        setActiveViewTask(true);
        let task = board?.tasks.find(task => task.id === id);
        setCurrentTask(task);
    }

    const handleDeleteBoard = async () => {
        await deleteBoard({
            variables: {
                boardid: id
            }, refetchQueries: [{ query: GET_ALL_BOARDS, variables: { boardid: id } }]
        });
    }

    const [windowSize, setWindowSize] = useState(getWindowSize());

    React.useEffect(() => {
        function handleWindowResize() {
            setWindowSize(getWindowSize());
        }
        
        window.addEventListener('resize', handleWindowResize);
        
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };

    });

    const {isHidden, setIsHidden} = React.useContext(ToggleAsideContext);

    return (
        <section className="tasklist">
            <header>
                <i className="fa-solid fa-bars" onClick={() => setIsHidden(false)}></i>

                <h1>{name}</h1>

                <div className="buttons">
                    <button className='create-task' onClick={() => setActiveCreateTask(true)}>
                        {windowSize.innerWidth > 500 ? '+ Add New Task' : '+'}
                    </button>
                    <button onClick={() => handleDeleteBoard()} className="delete-task">
                        <Link to={'/'}><i className="fa-solid fa-trash"></i></Link>
                    </button>
                </div>
            </header>

            <section className='tasks-content'>
                <div className="tasks-lists">
                    <div className="todo">
                        <h3><span className='sphere sphere-todo'></span> Todo ({todoTasks?.length})</h3>
                        {todoTasks?.map(task => (
                            <div key={task.id} onClick={() => handleViewTask(task.id)} className="task-card">
                                <h3>{task.name}</h3>
                                <p>{task.subTasks.length} substasks</p>
                            </div>
                        ))}
                    </div>

                    <div className="doing">
                        <h3><span className='sphere sphere-doing'></span> Doing ({doingTasks?.length})</h3>
                        {doingTasks?.map(task => (
                            <div key={task.id} onClick={() => handleViewTask(task.id)} className="task-card">
                                <h3>{task.name}</h3>
                                <p>{task.subTasks.length} substasks</p>
                            </div>
                        ))}
                    </div>

                    <div className="done">
                        <h3><span className='sphere sphere-done'></span> Done ({doneTasks?.length})</h3>
                        {doneTasks?.map(task => (
                            <div key={task.id} onClick={() => handleViewTask(task.id)} className="task-card">
                                <h3>{task.name}</h3>
                                <p>{task.subTasks.length} substasks</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            {activeCreateTask && <CreateTaskForm boardID={id} setActiveCreateTask={setActiveCreateTask} />}
            {activeViewTask && <ViewTask currentTask={currentTask} setActiveViewTask={setActiveViewTask} />}
        </section>
    )
}

function getWindowSize() {
    const { innerWidth, innerHeight } = window;
    return { innerWidth, innerHeight };
}