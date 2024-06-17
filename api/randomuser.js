// randomuser.js

const fetch = require('node-fetch');

const getRandomUser = async () => {
    try {
        const res = await fetch('https://randomuser.me/api/');
        const data = await res.json();
        const user = {
            nombre: `${data.results[0].name.first} ${data.results[0].name.last}`,
            email: data.results[0].email,
        };
        return user;
    } catch (err) {
        console.error('Error al obtener usuario aleatorio:', err);
        throw new Error('Error al obtener usuario aleatorio');
    }
};

module.exports = { getRandomUser };
