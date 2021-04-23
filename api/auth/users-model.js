const db = require('../../data/dbConfig.js');

module.exports = {
    add,
    find,
    findById
};

function find() {
    return db('users')
        .select('users.id', 'users.username', 'users.password')
}

function findById(id) {
    return db('users')
        .select('users.id', 'users.username', 'users.password')
        .where('users.id', id)
        .first()
}

async function add(user) {
    const [id] = await db('users').insert(user)
    return findById(id)
}