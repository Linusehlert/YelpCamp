const mongoose = require('mongoose')
const Campground = require('../models/campground')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/expressError')
const {campgroundsSchema} = require('../schemas')
mongoose.connect('mongodb://localhost:27017/yelp-camp', {})

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error"))
db.once("open", () => {
    console.log("Database connected")

})

const validateCampground = (req, res, next) => {
    const {error} = campgroundsSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else next()
}
module.exports = function (app) {
    //INDEX
    app.get('/campgrounds', catchAsync(async (req, res) => {
        const campgrounds = await Campground.find({})
        res.render('campgrounds/index', {campgrounds})
    }))

//NEW
    app.get('/campgrounds/new', (req, res) => {
        res.render('campgrounds/create', {})
    })

//CREATE
    app.post('/campgrounds', validateCampground, catchAsync(async (req, res) => {
        const campground = await Campground.create(req.body)
        console.log(campground)
        res.redirect(`/campgrounds/${campground._id}`)
    }))

//SHOW
    app.get('/campgrounds/:id', catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id)
        res.render('campgrounds/show', {campground})
    }))

//EDIT
    app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id)
        res.render('campgrounds/edit', {campground})
    }))

//UPDATE
    app.put('/campgrounds/:id',  validateCampground, catchAsync(async (req, res) => {
        const campground = await Campground.findByIdAndUpdate(req.params.id, req.body)
        res.redirect(`/campgrounds/${campground._id}`)
    }))

//DELETE
    app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
        await Campground.findByIdAndRemove(req.params.id)
        res.redirect(`/campgrounds`)
    }))

    app.all('*', (req, res, next) => {
        next(new ExpressError('Page Not Found', 404))
    })

    app.use((err, req, res, next) => {
        const {statusCode = 500} = err
        if (!err.message) err.message = 'Something went Wrong'
        res.status(statusCode).render('error', {err})
    })
}