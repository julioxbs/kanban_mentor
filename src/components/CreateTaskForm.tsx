import { gql, useMutation } from '@apollo/client'
import React from 'react'
import { GET_ALL_BOARDS } from '../App'

const CREATE_TASK = gql`
    mutation CreateTask($taskInput: TaskInput, $boardid: String) {
        createTask(taskInput: $taskInput, boardid: $boardid)
    }
`

interface ICreateTaskForm {
    boardID: string
    setActiveCreateTask: (value: boolean) => void
}

export const CreateTaskForm = ({ boardID, setActiveCreateTask }: ICreateTaskForm) => {
    const [subTasksInput, setSubTasks] = React.useState([]);
    const [countInput, setCountInput] = React.useState(0);
    const [createTask] = useMutation(CREATE_TASK);
    const [inputs, setInputs] = React.useState({
        name: "",
        description: "",
        status: "",
        subTasks: Array(),
    });

    const getValues = (e: any) => {
        setInputs({
            ...inputs,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const { subTasks } = inputs;

        if (Object.values(subTasksInput).length > 0) inputs.subTasks.push(subTasksInput);
        let res = subTasksInput.length === 0 ? [] : Array.from(Object.values(subTasks[0]));

        if (inputs.name !== "" && inputs.description !== "") {
            await createTask({
                variables: {
                    taskInput: {
                        name: inputs.name,
                        description: inputs.description,
                        status: inputs.status === "" ? "todo" : inputs.status,
                        subTasks: res,
                    }, boardid: boardID
                }, refetchQueries: [{ query: GET_ALL_BOARDS }]
            });
        }
    }

    const closeDialog = (e: any) => {
        if (e.target.className === 'cta') {
            setActiveCreateTask(false);
        }
    }

    React.useEffect(() => {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                setActiveCreateTask(false);
            }
        });
    }, [setActiveCreateTask]);

    return (
        <dialog className='cta' onClick={e => closeDialog(e)}>
            <div className="content--create_task">
                <form>
                    <h3>Add new task</h3>

                    <label htmlFor="name">
                        Title
                        <input onChange={e => getValues(e)} name="name" type="text" placeholder="e.g Take coffe break" />
                    </label>

                    <label htmlFor="description">
                        Description
                        <textarea rows={4} cols={50} onChange={e => getValues(e)} name="description" placeholder="e.g It's always good take a break. This 15 minute break will recharge the batteries a little." />
                    </label>

                    <div className='subtasks-content'>
                        <label htmlFor="subtask">
                            Subtasks ({countInput} of 3)
                            {Array.from(Array(countInput)).map((c, index) => {
                                return <input key={index} name={'' + index} type="text" onChange={e => {
                                    setSubTasks({
                                        ...subTasksInput,
                                        [e.target.name]: {
                                            title: e.target.value,
                                            status: "incomplete",
                                        }
                                    })
                                }} />
                            })}
                        </label>

                        <button onClick={e => {
                            e.preventDefault();
                            setCountInput(countInput + 1);
                        }} disabled={countInput === 3 ? true : false}>Add subTask</button>
                    </div>

                    <label htmlFor="status">
                        <select name="status" id="status" onChange={e => getValues(e)}>
                            <option value="todo">Todo</option>
                            <option value="doing">Doing</option>
                            <option value="done">Done</option>
                        </select>
                    </label>

                    <button className='createtask-btn' onClick={e => {
                        handleSubmit(e)
                        setActiveCreateTask(false);
                    }}>Create Task</button>
                </form>
            </div>
        </dialog>
    )
}