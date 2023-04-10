var express = require('express');
const db = require("../service/db");
var router = express.Router();

router.get('/user', async (req, res) => {
    let user_id = req.query.id || -1;
    res.json(await db.getUserInfo(user_id) || {});
});

router.get('/question', async (req, res) => {
    let question_id = req.query.id || -1;
    res.json(await db.getQuestion(question_id) || {});
});

router.get('/allquestion', async (req, res) => {
    let email = req.query.email || '';
    res.json(await db.getAllQuestion(email) || {});
});

router.post('/answer', async (req, res) => {
    let question_id = req.body.question_id || -1;
    let answer = req.body.answer || '';
    if (question_id === -1 || answer === '') {
        res.json({message: 'Invalid params'});
        return;
    }
    res.json(await db.answer(question_id, answer));
});
router.post('/login', async (req, res) => {
    let email = req.body.email || '';
    let name = req.body.name || '';
    let src = req.body.src || '';
    if (email === '' || name === '' || src === '') {
        res.json({message: 'Invalid params'});
        return;
    }
    res.json(await db.login(email, name, src));
});

router.post('/ask', async (req, res) => {
    let email_ask = req.body.email || '';
    let user_id_ans = req.body.user_id_ans || -1;
    let question = req.body.question || '';
    if (email_ask === '' || user_id_ans === -1 || question === '') {
        res.json({message: 'Invalid params'});
        return;
    }
    res.json(await db.ask(email_ask, user_id_ans, question));
});

router.get('/allanswer', async (req, res) => {
    let email = req.query.email || '';
    res.json(await db.getAllAnswer(email) || {});
});
module.exports = router;
