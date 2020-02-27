const path = require('path')
const express = require('express')
const PostsService = require('./posts-service')

const postsRouter = express.Router()
const jsonParser = express.json()

// Router set up for posts endpoint. Get and post for 'all'.
postsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    PostsService.getAllPosts(knexInstance)
      .then(post => {
        res.json(post)
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { title, content, date_posted } = req.body
    const newPost = { title, content, date_posted }
        
    for (const [key, value] of Object.entries(newPost)) {
      if (typeof value === 'string') {
        newPost[key] = value.trim()
      }
    }

    for (const [key, value] of Object.entries(newPost)) {
      if (!value)
        return res.status(400).json({
          error: { message: `Uh oh! You are missing '${key}' in your submission. Please ensure you fill out all fields!` }
        })
    }
    

    PostsService.insertPost(
      req.app.get('db'),
      newPost
    )
      .then(post => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${post.id}`))
          .json(post)
      })
      .catch(next)
  })

  // Router set up for posts endpoint. Using ID, can get, delete, and patch.
  postsRouter
  .route('/:post_id')
  .all((req, res, next) => {
    PostsService.getById(
      req.app.get('db'),
      req.params.post_id
    )
      .then(post => {
        if (!post) {
          return res.status(404).json({
            error: { message: `post doesn't exist` }
          })
        }
        res.post = post
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(res.post)
  })
  .delete((req, res, next) => {
    PostsService.deletePost(
      req.app.get('db'),
      req.params.post_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { title, content, date_posted } = req.body
    const postToUpdate = { title, content, date_posted }

    const numberOfValues = Object.values(postToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must content either 'title', 'content', and 'date posted'`
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

module.exports = postsRouter
