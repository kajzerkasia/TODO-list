const input = document.querySelector('.input-type-task');
const listOfTasks = document.querySelector('.div-tasks-list ul');
const li = document.querySelector('li');
const btnAddTask = document.querySelector('.btn-add-task');

const emptyInputInfo = 'You need to type something here.';

let newTask;
let idNumber = 0;

window.addEventListener('load', async () => {
    await loadTasks(listOfTasks)
});

const form = document.querySelector('form');

form.addEventListener('submit', async event => {
    event.preventDefault();

    const id = +newTask.getAttribute('id');

    const res = await fetch('/task', {
        method: 'POST',
        body: JSON.stringify({
            task: input.value,
            id,
            completed: false,
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    })
    input.value = '';
});

const setAttributesDisabled = () => {
    input.setAttribute('disabled', 'disabled');
    btnAddTask.setAttribute('disabled', 'disabled')
}

const removeAttributesDisabled = () => {
    input.removeAttribute('disabled');
    btnAddTask.removeAttribute('disabled')
}


const error = () => {
    setAttributesDisabled();
    input.value = emptyInputInfo;

    setTimeout(() => {
        input.value = '';
        removeAttributesDisabled();
    }, 3000);
}

const createButtons = (listItemNode, id) => {
    const tools = document.createElement('div');
    tools.classList.add('buttons');
    listItemNode.appendChild(tools);

    const doneBtn = document.createElement('button');
    doneBtn.classList.add('btn-done-task');
    doneBtn.setAttribute('type', 'button');
    doneBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i>'
    doneBtn.setAttribute('data-id', id.toString())
    doneBtn.addEventListener('click', () => handleTaskDone(id));

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('btn-remove-task');
    deleteBtn.setAttribute('type', 'button');
    deleteBtn.innerHTML = '<i class="fa-solid fa-circle-xmark">'
    deleteBtn.setAttribute('data-id', id.toString())
    deleteBtn.addEventListener('click', () => handleTaskRemove(id));

    tools.appendChild(doneBtn);
    tools.appendChild(deleteBtn)
}

const createTask = () => {
    idNumber++;
    newTask = document.createElement('li');
    newTask.innerText = input.value;
    newTask.setAttribute('id', `${idNumber}`);
    newTask.setAttribute('href', '/task');
    listOfTasks.appendChild(newTask);

    createButtons(newTask, idNumber);

}

const checkEnter = () => {

    if (event.keyCode === 13) {
        addNewTask();
    }
}

const addNewTask = () => {
    if (input.value !== '') {

        (!/\S/.test(input.value)) ? error() : createTask()

    } else {
        error();
    }
}

const handleTaskDone = async (id) => {

    const res = await fetch(`/task/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
            completed: true,
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    })
    await loadTasks(listOfTasks)
}

const handleTaskRemove = async id => {

    const res = await fetch(`/task/${id}`, {
        method: 'DELETE',
    })
    await loadTasks(listOfTasks)
}


const loadTasks = async container => {
    container.innerHTML = '';

    container.classList.add('isLoading');

    const res = await fetch('/task', {
        method: 'GET',
    })
    const tasks = await res.json();
    container.classList.remove('isLoading');
    tasks.forEach(task => {
        newTask = document.createElement('li');
        if (task.completed) {
           newTask.classList.add('done');
        }

        newTask.innerText = task.task;
        newTask.setAttribute('id', task.id.toString());
        newTask.setAttribute('href', '/task');
        listOfTasks.appendChild(newTask);
        createButtons(newTask, task.id);

    })
    idNumber = tasks.reduce((max, task) => Math.max(max, task.id), 0)
}

btnAddTask.addEventListener('click', addNewTask);
input.addEventListener('keyup', checkEnter);

