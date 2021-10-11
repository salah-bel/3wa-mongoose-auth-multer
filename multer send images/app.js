const express = require('express')
const app = express()
const path = require('path')
const port = 4200

const multer = require('multer')

app.set('view engine', 'ejs')
app.use(express.static('./public'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
})
const upload = multer({ storage: storage });


app.get('/', (req, res) => {
    res.render('index')
});

app.get('/show', (req, res) => {

    res.render('show');
})

app.post('/upload', upload.single('image'), (req, res) => {
    console.log(req.file)
    console.log('imgUrl :', req.file.path)

});


app.listen(port, () => console.log(`Example app listening on port port!`))