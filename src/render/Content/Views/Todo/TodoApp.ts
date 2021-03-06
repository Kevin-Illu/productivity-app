import { addTodo, Todo } from '../../../types/index';
import { RemoveChild } from '../../../utils/RemoveChild.js';
import TaskForm from './Form/TaskForm.js';
import { TodoList } from './TodoList.js'


class TodoApp {
    private todos: Todo[];
    private parent: HTMLElement | null;
    private taskForm: TaskForm;


    constructor(parentElement: HTMLElement) {
        this.todos = JSON.parse(localStorage.getItem('todos') || "[]") || [];
        this.parent = parentElement;
        this.taskForm = new TaskForm();    
    }

    _commit = () => {
        localStorage.setItem('todos', JSON.stringify(this.todos));
        this.displayTodos();
    }

    setParent (parentElement: HTMLDivElement) {
        this.parent = parentElement;
    }

    displayAddForm = () => {
        if(!this.parent) return;
        RemoveChild(this.parent);
        this.taskForm.addForm(this.addTodo)
        this.parent.appendChild(this.taskForm.form);
    }
    
    displayUpdateForm = (todo: Todo) => {
        if(!this.parent) return;
        RemoveChild(this.parent);
        this.taskForm.updateForm(todo, this.editTodo);
        this.parent.appendChild(this.taskForm.form);
    }

    // CRUD
    displayTodos = () => {
        if(!this.parent) return;
        RemoveChild(this.parent);
        const handlers = [
            this.displayAddForm,
            this.displayUpdateForm,
            this.deleteTodo,
            this.editTodo,
        ];
        const todoList = TodoList(this.todos, handlers);
        this.parent.appendChild(todoList);
    }

    addTodo = ({title, description, state}: addTodo) => {
        const todo = {
            id: this.todos.length > 0 ?
                this.todos[this.todos.length - 1].id + 1
                : 1,
            title,
            description,
            state
        }

        this.todos.push(todo);
        this._commit();
    }

    editTodo = ({id, title, description, state}: Todo) => {
        this.todos = this.todos.map((todo) =>
            todo.id === id ? {
                id: todo.id,
                title,
                description,
                state,
            } : todo)
        this._commit();
    }

    deleteTodo = (id: number) => {
        this.todos = this.todos.filter(todo => todo.id !== id)
        this._commit();
    }
}

export default TodoApp;
