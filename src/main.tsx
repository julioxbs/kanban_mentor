import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { App } from './App'
import { ToggleAsideProvider } from './context/ToggleContext'
import './index.css'
import { TaskList } from './pages/TaskList'

export const client = new ApolloClient({
  uri: 'https://kabanapp.herokuapp.com',
  cache: new InMemoryCache()
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <ToggleAsideProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route path="/:task" element={<TaskList />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToggleAsideProvider>
    </ApolloProvider>
  </React.StrictMode>
)
