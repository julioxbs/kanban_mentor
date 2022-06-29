import { gql, useMutation } from '@apollo/client';
import React from 'react'
import { useParams } from 'react-router-dom';
import { GET_TASK_BY_ID } from '../pages/TaskList';

const UPDATE_TASK = gql`
    mutation Mutation($boardid: String, $taskid: String, $taskInput: TaskInput) {
        updateTask(boardid: $boardid, taskid: $taskid, taskInput: $taskInput)
    }
`

const DELETE_TASK = gql`
    mutation DeleteTask($boardid: String, $taskid: String) {
        deleteTask(boardid: $boardid, taskid: $taskid)
    }
`

interface currentTaskProps {
    currentTask: {
        id: string
        name: string
        description: string
        status: string
        subTasks: {
            id: string
            title: string
            status: string
        }[]
    },
    setActiveViewTask: (task: any) => void
}

export const ViewTask = ({ currentTask, setActiveViewTask }: currentTaskProps) => {
    const { task } = useParams();

    const { name, description, subTasks } = currentTask;
    const [newNameValue, setNewName] = React.useState('');
    const [newDescriptionValue, setNewDescription] = React.useState('');
    const [newStatusValue, setNewStatus] = React.useState('');

    const [updateTask] = useMutation(UPDATE_TASK);
    const [deleteTask] = useMutation(DELETE_TASK);

    const handleUpdateTask = async () => {
        let obj = {
            name: newNameValue === "" ? currentTask.name : newNameValue,
            description: newDescriptionValue === "" ? currentTask.description : newDescriptionValue,
            status: newStatusValue === "" ? currentTask.status : newStatusValue,
        }

        await updateTask({
            variables: {
                boardid: task,
                taskid: currentTask.id,
                taskInput: obj
            }, refetchQueries: [{ query: GET_TASK_BY_ID, variables: { boardid: task } }]
        });
    }

    const handleDeleteTask = async () => {
        await deleteTask({
            variables: {
                boardid: task,
                taskid: currentTask.id
            }, refetchQueries: [{ query: GET_TASK_BY_ID, variables: { boardid: task } }]
        });

        setActiveViewTask(false);
    }

    return (
        <dialog className='cta' onClick={(e) => (e.target as HTMLElement).className === "cta" ? setActiveViewTask(false) : null}>
            <div className="viewtask-content">
                <div className="header">
                    <i className="fa-solid fa-pen"></i>
                    <h3 contentEditable="true"
                        suppressContentEditableWarning={true}
                        onInput={(e) => setNewName((e.target as HTMLElement).innerText)}>
                        {name}
                    </h3>

                    <button className='delete-task' onClick={() => handleDeleteTask()}><i className="fa-solid fa-trash-can"></i></button>
                </div>


                <div className='desc-content'>
                    <i className="fa-solid fa-pen"></i>

                    <p onInput={(e) => setNewDescription((e.target as HTMLElement).innerText)}
                        contentEditable="true"
                        suppressContentEditableWarning={true} className="description">
                        {description}
                    </p>
                </div>

                <div className='substasks-info'>
                    <p>Substasks ({subTasks.length})</p>

                    {subTasks.map(subTask => (
                        <div key={subTask.id}>
                            <span>{subTask.title}</span>
                        </div>
                    ))}
                </div>

                <label htmlFor="status">
                    Status
                    <select name="status" id="status" onChange={(e) => setNewStatus(e.target.value)}>
                        <option value="todo">Todo</option>
                        <option value="doing">Doing</option>
                        <option value="done">Done</option>
                    </select>
                </label>

                <button className='update-btn' onClick={() => {
                    handleUpdateTask()
                    setActiveViewTask(false)
                }}>Update</button>
            </div>
        </dialog>
    )
}