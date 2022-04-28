const express = require('express')
const exphbs = require('express-handlebars')
const Connection = require('mysql/lib/Connection')

const pool = require('./db/conn')

const app = express()
const port = 3000

app.use(express.static('public'))

app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars' )

app.use(express.urlencoded({
    extended:true
}))

app.use(express.json())


app.get('/',(req,res)=>{

    const query = 'SELECT * FROM livros;'
    pool.query(query,(err,data)=>{

        if(err){
            console.log(err)
        }else{
            const books = data
            res.render('home',{books})
        }      
    })
})

app.get('/cadastrar',(req,res)=>{

    res.render('cadastrar')
})

app.post('/cadastrar/create',(req,res)=>{
    const nome = req.body.nome
    const author = req.body.author
    const qtp = req.body.qtp

    const query = `INSERT INTO livros(nome,qtp,author) VALUES ('${nome}','${qtp}','${author}') `

    pool.query(query,(err,data)=>{
        if(err){
            console.log(err)
        }else{

            res.redirect('/')
        }
    })

})

app.get('/editar/:id',(req,res)=>{

    const id = req.params.id

    const query = `SELECT * FROM livros WHERE id=${id}`
    
    pool.query(query,(err,data)=>{

        const book = data[0]
        res.render('editar',{book})

    })
})

app.post('/update',(req,res)=>{
    const id = req.body.id
    const nome= req.body.nome
    const qtp = req.body.qtp
    const author = req.body.author

    const data = ['id', id, ]

    const query =`UPDATE livros SET id = ${id}, nome = '${nome}', qtp = '${qtp}', author= '${author}' WHERE id=${id}`

    pool.query(query,(err)=>{
        if(err){
            console.log(err)
        }else{
            res.redirect(`/editar/${id}`)
        }
    })
})

app.get('/delete/:id',(req,res)=>{
    const id = req.params.id
    const query = `DELETE FROM livros WHERE id = ${id}`

    pool.query(query,(err)=>{
        if(err){
            console.log(err)
        }else{
            res.redirect('/')

        }
    })

})






app.listen(port,()=>{
    console.log('Servidor rodando!!')
})