import { gql, useMutation, useQuery } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Aside } from './components/Aside';
import { TaskList } from './pages/TaskList';

export const GET_ALL_BOARDS = gql`
  query Query {
    showBoards {
      id
      name
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
  }
`;

const CREATE_BOARD = gql`
  mutation Mutation($input: String) {
    createBoard(input: $input)
  }
`

export interface IBoard {
  id: string
  name: string
}

export const App = () => {
  const { task } = useParams();

  const { data } = useQuery(GET_ALL_BOARDS);
  const [createBoard] = useMutation(CREATE_BOARD);
  const allBoards = data?.showBoards;

  const [boardName, setBoardName] = React.useState("");
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (boardName) {
      await createBoard({
        variables: { input: boardName },
        refetchQueries: [{ query: GET_ALL_BOARDS }]
      });
      setBoardName("");
    }
  }

  return (
    <main>
      <Aside handleSubmit={handleSubmit} allBoards={allBoards} setBoardName={setBoardName} boardName={boardName} />

      {task && <TaskList />}
    </main>
  )
}