const path = require('path')
const express = require('express')
const CommentsService = require('./comments-service')

const commentsRouter = express.Router()
const jsonParser = express.json()

// Router set up for comments endpoint. '/' set up for get and post
commentsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    CommentsService.getAllComments(knexInstance)
      .then(comment => {
        res.json(comment)
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { content, date_posted, post_id } = req.body
    const newComment = { content, date_posted, post_id }

    for (const [key, value] of Object.entries(newComment)) {
      if (typeof value === 'string') {
        newComment[key] = value.trim()
      }
    }

    for (const [key, value] of Object.entries(newComment)) {
      if (!value)
        return res.status(400).json({
          error: { message: `Uh oh! Your entry wasn't accepted. Please ensure your comment has content!` }
        })
    }

    CommentsService.insertComment(
      req.app.get('db'),
      newComment
    )
      .then(comment => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${comment.id}`))
          .json(comment)
      })
      .catch(next)
  })

  // Router set up for comments endpoint. Using ID, can get, delete, and patch.
  commentsRouter
  .route('/:comment_id')
  .all((req, res, next) => {
    CommentsService.getById(
      req.app.get('db'),
      req.params.comment_id
    )
      .then(comment => {
        if (!comment) {
          return res.status(404).json({
            error: { message: `comment doesn't exist` }
          })
        }
        res.comment = comment
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(res.comment)
  })
  .delete((req, res, next) => {
    CommentsService.deleteComment(
      req.app.get('db'),
      req.params.comment_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { content, date_posted, post_id } = req.body
    const commentToUpdate = { content, date_posted, post_id }

    const numberOfValues = Object.values(commentToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must content either 'content', 'date posted', or 'post_id'`
        }
      })

    CommentsService.updateComment(
      req.app.get('db'),
      req.params.comment_id,
      commentToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = commentsRouter
