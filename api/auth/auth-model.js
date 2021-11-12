const db = require("../../data/dbConfig")

function findBy(filter) {
    return db("users as u")
        .select("id", "username", "u.password")
        .where(filter);
}

function findById(id) {
    return db("users")
        .select("id", "username", "password")
        .where("id", id)
        .first();
}

async function add(user) {
    const [id] = await db("users").insert(user);
    return findById(id)
}

module.exports = {
    findBy,
    findById,
    add
}