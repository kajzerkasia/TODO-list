const express = require('express');
const {readFile, writeFile} = require('fs').promises;

const FILE_NAME = './data/tasks.json';
const taskRouter = express.Router();

taskRouter

    .post('/', async (req, res) => {

        console.log(req.body);
        const data = JSON.parse(await readFile(FILE_NAME, 'utf8'));
        data.push(req.body);
        await writeFile(FILE_NAME, JSON.stringify(data, null, 2));

        res.status(200).end();

    })

    .get('/', async (req, res) => {
        res.status(200).json(JSON.parse(await readFile(FILE_NAME, 'utf8')));
    })

    .patch('/:id', async (req, res) => {
        const id = +req.params.id;
        const patchedTask = req.body;

        const data = JSON.parse(await readFile(FILE_NAME, 'utf8'));

        const newData = data.map(task => task.id === id ? {...task, ...patchedTask} : task)
        await writeFile(FILE_NAME, JSON.stringify(newData, null, 2));

        res.status(200).end();

    })

    .delete('/:id', async (req, res) => {
        const id = +req.params.id;

        const data = JSON.parse(await readFile(FILE_NAME, 'utf8'));
        const newData = data.filter(task => task.id !== id)
        await writeFile(FILE_NAME, JSON.stringify(newData, null, 2));

        res.status(200).end();
    })

module.exports = {
    taskRouter,
};