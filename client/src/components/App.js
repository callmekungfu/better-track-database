import React from 'react';
import Footer from './Footer';
import ServerData from './ServerData';
import AddTodo from '../containers/AddTodo';
import VisibleTodoList from '../containers/VisibleTodoList';

const App = () => (
    <div>
        <AddTodo />
        <VisibleTodoList />
        <Footer />
        <ServerData />
    </div>
);

export default App;
