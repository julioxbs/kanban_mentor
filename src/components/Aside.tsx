import React from 'react'
import { Link, useParams } from 'react-router-dom';
import { IBoard } from '../App';
import { ToggleAsideContext } from '../context/ToggleContext';

interface IAsideProps {
    allBoards: IBoard[]
    setBoardName: (name: string) => void;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    boardName: string;
};

export const Aside = ({ allBoards, setBoardName, boardName, handleSubmit }: IAsideProps) => {
    const { task } = useParams();
    const {isHidden, setIsHidden} = React.useContext(ToggleAsideContext);

    return (
        <aside className={isHidden ? 'hidden' : ''}>
            <div className="content">
                <div className="header">
                    <h1>Kanban</h1>

                    <p>All boards ({allBoards?.length})</p>

                    <i className="fa-solid fa-xmark" onClick={() => setIsHidden(!isHidden)}></i>
                </div>

                <ul>
                    {allBoards?.map(board => (
                        <Link key={board.id} to={board.id} state={board} className={task === board.id ? 'active' : ''}>
                            <li className='board-name'><i className="fa-solid fa-list-check"></i> {board.name}</li>
                        </Link>
                    ))}
                </ul>

                <form onSubmit={(handleSubmit)} className="form-createBoard">
                    <i className="fa-solid fa-list-check"></i>
                    <input
                        value={boardName}
                        onChange={e => setBoardName(e.target.value)}
                        type="text"
                        placeholder='+ Create New Board' />
                </form>
            </div>
        </aside>
    )
}
