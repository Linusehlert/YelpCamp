const express = require('express')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const path = require('path');
const app = express()

app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: true}))

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


const campgrounds = require('./controllers/campgrounds')(app)

app.listen(3000, () => {
    console.log("Listening on port 3000")
})