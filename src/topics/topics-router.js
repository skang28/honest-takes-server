const express = require('express')
const TopicsService = require('./topics-service')

const topicsRouter = express.Router()

topicsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    TopicsService.getAllTopics(knexInstance)
      .then(topic => {
        res.json(topic)
      })
      .catch(next)
  })

module.exports = topicsRouter