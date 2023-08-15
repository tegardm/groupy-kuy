const express = require('express')
const { loadUsers, addUsers, hapusUser, findUser, cekDuplikat, groupedData, downloadFile, deleteAll } = require('./utils/methods')
const port = process.env.PORT || 3000
const app = express()
const session = require('express-session')
const cookieParser = require('cookie-parser')
const connectFlash = require('connect-flash')
const {body, validationResult, check} = require('express-validator')
const axios = require('axios')
const fs = require('fs')

// Konfigurasi Flash
app.use(cookieParser('secret'));
app.use(session({
    cookie : {MaxAge :6000},
    secret : 'secret',
    resave : true,
    saveUninitialized : true

})
)
app.use(connectFlash());

// Ejs
app.set('view engine','ejs')

// Static Files
app.use(express.static('src'))
app.use(express.urlencoded({ extended: true }));

// Home Page
app.get('/',(req,res) => {
    res.render('index', {title : "Home Page "})
})



// Jokes Page 
app.get('/jokes', async (req, res) => {
    axios.get('https://candaan-api.vercel.app/api/text/random')
    .then((response) => {
        const result1 = response.data;

        axios.get('https://candaan-api.vercel.app/api/image/random')
        .then((response) => {
            const result2 = response.data; 
        
            // console.log(result1.data,result2.data.url);
            res.render('jokes', {title : "Jokes Page", textData : result1.data, 
            imgData : result2.data})
        })
        
      

    })
    .catch((error) => {
        console.error('An error occurred:', error);
    });
});




// Grouping  Page
app.get('/group', (req,res) => {
    const dirPath = './data'
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath)
    } 
    
    const filePath = './data/users.json'
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath,'[]', 'utf-8')
    } 

    const groupedDataJSON = req.query.data ? JSON.parse(req.query.data) : undefined;
    

    const data = loadUsers()
    res.render('group', {title : "Groupy Page", msg : req.flash('msg'), data, groupedDataJSON})
})

app.get('/group/delete-all',(req,res) => {
    deleteAll();
    console.log('ok');
    req.flash('msg','Semua Data Berhasil Di Hapus !')
    res.redirect('/group')
})

// About Page
app.get('/about', (req,res) => {
    res.render('about', {title : "About Page"})
})


// Proses Add User
app.post('/group',[
    body('nama').custom((value) => {
        const duplikat = cekDuplikat(value);
        if (duplikat) {
            throw new Error(`Maaf Peserta Dengan Nama <strong>${value}</strong> Sudah Ada`);
        }
        return true;
    }),
    body('umur').custom((value, { req }) => {
        if (!/^\d{2}$/.test(value) && !/^\d{1}$/.test(value)) {
            throw new Error(`Maaf <strong>${value}</strong> bukan sebuah angka dua digit`);
        }
        return true;
      })
    ] ,
    (req,res) => {
    const groupedDataJSON = req.query.data ? JSON.parse(req.query.data) : undefined;
    const data = loadUsers()
    const error = validationResult(req);
    if (!error.isEmpty()) {
        res.render('group', {groupedData,msg : req.flash('msg'),
        title : "Group Page", errors : error.array(), data,groupedDataJSON, downloadFile})
    } else {
    addUsers(req.body)   
    req.flash('msg','Data User Berhasil Ditambahkan!')
    res.redirect('group')
    }


})

app.post('/grouped', (req,res) => {
    const grouped = groupedData(req.body.amount)
    res.redirect('/group?data=' + encodeURIComponent(JSON.stringify(grouped)));
    
    
})


// Proses Delete User
app.get('/group/delete/:nama', (req,res) => {
    const user = findUser(req.params.nama)
    if (!user) {
        res.status("404")
        res.send('<h1>404 Error Page</h1>')
    } else {
        hapusUser(req.params.nama)
        req.flash('msg',`Data User Bernama ${req.params.nama}`)
        res.redirect('/group')
    }
  
})



// Default Page
app.use('/',(req,res) => {

    res.status(404)
    res.send("<h1>404 Error Page</h1>")
    
})

app.listen(port, () => console.log('Server Online Listened to 3000'))