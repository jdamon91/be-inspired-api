require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')

const userRouter = require('./user/userRouter')

const morganOption = (process.env.NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(express.json())
app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

const videos = [
    "Sport Video: A Sport video",
    "Humor Video: A Humourous Video"
]

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }
    // move to the next middleware
    next()
})

app.use('/api/users', userRouter)

function getUserVideos(req, res) {
    res.json('Videos')
}

app.get('/api/search-videos', function getFilteredVideos(req,res) {
    let response = videos
        if (req.query.title) {
            response = response.filter(video =>
                video.title.toLowerCase().includes(req.query.title.toLowerCase())
            )
        }
        res.json(response)
    }
)

app.get('/testing', (req,res) => {
    res.send('Hello')
})

app.post('/user', (req, res) => {
    // some code
})

app.delete('/user/userId', (req, res) => {
    const { userid } = req.params
    // some code
    res
      .status(204)
      .end();
})

app.get('/api/user-videos', getUserVideos)

app.use((error, req, res ,next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
        response = { error: { message: 'server error' }}
    } else {
        response = { error }
    }
    res.status(500).json(response)
})

module.exports = app