const {Database} = require("sqlite3");
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.sqlite');

const getUserInfo = (user_id) => {
    return new Promise((resolve) => {
        db.get(`SELECT *
                FROM users
                WHERE id = ${user_id}`, (err, row) => {
            console.log(err)
            resolve(row);
        });
    });
}

const getQuestion = (question_id) => {
    return new Promise((resolve) => {
        db.get(`SELECT *
                FROM questions q
                            JOIN users u on q.user_id_ask = u.id
                WHERE q.id = ${question_id}`, (err, row) => {
            console.log(err)
            resolve(row);
        });
    });
}

const getAllQuestion = (email) => {
    return new Promise((resolve) => {
        db.all(`SELECT *, questions.id as question_id
                FROM questions
                         JOIN users ON questions.user_id_ans = users.id
                WHERE user_id_ans = (select id from users where email = '${email}')`, (err, row) => {
            console.log(err)
            resolve(row);
        });
    });
}

const login = (email, name, src) => {
    return new Promise((resolve) => {
        db.get(`SELECT *
                FROM users
                WHERE email = '${email}'`, (err, row) => {
            if (row === undefined) {
                console.log('insert');
                db.all(`INSERT INTO users (name, email, link_avatar)
                        VALUES ('${name}', '${email}', '${src}')
                        returning id`, (err, row) => {
                    resolve({message: 'success'});
                });
            } else {
                console.log('update');
                db.run(`UPDATE users
                        SET name        = '${name}',
                            link_avatar = '${src}'
                        WHERE email = '${email}'`, (err) => {
                    resolve({message: 'success'});
                });
            }
        });
    });
}

const ask = (email_ask, user_id_ans, question) => {
    return new Promise((resolve) => {
        db.all(`INSERT INTO questions (user_id_ask, user_id_ans, question)
                VALUES ((select id from users where email = '${email_ask}'), ${user_id_ans}, '${question}')
                returning id`, (err, row) => {
            console.log(row);
            resolve({message: 'success', id: row[0].id});
        });
    });
}

const answer = (question_id, answer) => {
    return new Promise((resolve) => {
        db.run(`UPDATE questions
                SET answer = '${answer}'
                WHERE id = ${question_id}`, (err) => {
            resolve({message: 'success'});
        });
    });
}

const getAllAnswer = (email) => {
    return new Promise((resolve) => {
        db.all(`SELECT *
                FROM questions
                WHERE user_id_ask = (select id from users where email = '${email}')`, (err, row) => {
            console.log(err)
            resolve(row);
        });
    });
}
module.exports = {getUserInfo, getQuestion, login, ask, getAllQuestion, answer, getAllAnswer};