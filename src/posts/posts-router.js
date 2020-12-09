const express = require('express')
require('dotenv').config()
const PostsService = require('./posts-service')
const {cloudinary} = require('../utils/cloudinary')
const postsRouter = express.Router()
const jsonParser = express.json()

postsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    PostsService.getAllPosts(knexInstance)
      .then(posts => {
        res.json(posts)
      })
      .catch(next)
  })
  .post(jsonParser, async (req, res, next) => {
    const { post_description, post_uploader_id, content_url } = req.body
    const newPost = { post_description, post_uploader_id, content_url }
    try {
      const uploadedResponse = (content_url) ? await cloudinary.uploader.upload(content_url, {
        upload_preset: 'default'
      }) : ''
      console.log(uploadedResponse)
      res.json({msg: "YAYAYAYAYA"}) 
    } catch (error) {
      
    }

    for (const [key, value] of Object.entries(newPost))
      if (value == null)
          return res.status(400).json({
            error: { message: `Missing '${key}' in request body` }
        })

    PostsService.insertPost(
      req.app.get('db'),
      newPost
    )
      .then(post => {
        res
          .status(201)
          .location(`/posts/${post.id}`)
          .json(post)
      })
      .catch(next)
  })

postsRouter
  .route('/:post_id')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    PostsService.getById(knexInstance, req.params.post_id)
      .then(post => {
        if (!post) {
          return res.status(404).json({
            error: { message: `Post doesn't exist` }
          })
        }
        res.json(post)
      })
      .catch(next)
  })

  .delete((req, res, next) => {
    PostsService.deleteById(
      req.app.get('db'),
      req.params.post_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

  .patch(jsonParser, (req, res, next) => {
    const { post_description, post_uploader_id, content_url } = req.body
    const postToUpdate = { post_description, post_uploader_id, content_url }

    const numberOfValues = Object.values(postToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'post description', 'post uploader id', 'content url'`
        }
      })

    PostsService.updatePost(
      req.app.get('db'),
      req.params.post_id,
      postToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

  postsRouter
  .route('/media')
  app.post('/media', async (req, res) => {
    try {
      const { previewSource } = req.body;
      const uploadedResponse = await cloudinary.uploader.upload(previewSource, {
        upload_preset: 'inspired'
      })
      const photo_url = uploadedResponse.secure_url;
      console.log(uploadedResponse)
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
})


module.exports = postsRouter