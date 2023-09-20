import bcrypt from 'bcrypt'
const usuarios = [
    { 
    nombre: 'Anorio',
    email: 'anorio@anor.com',
    confirmado: 1,
    password: bcrypt.hashSync('password',10)
    },
    {
        nombre: 'Dinora',
        email: 'dinora@eduvina.com',
        confirmado: 1,
        password: bcrypt.hashSync('password',10)
        
    }
]

export default usuarios