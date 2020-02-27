// TopicsService set up for crud operations on topics table.
const TopicsService = {
    getAllTopics(knex) {
        return knex.select('*').from('topics')
    },
    insertTopic(knex, newTopic) {
        return knex
          .insert(newTopic)
          .into('topics')
          .returning('*')
          .then(rows => {
            return rows[0]
          })
      },
      getById(knex, id) {
        return knex.from('topics').select('*').where('id', id).first()
      },
      deleteTopic(knex, id) {
        return knex('topics')
          .where({ id })
          .delete()
      },
      updateTopic(knex, id, newTopicFields) {
        return knex('posts')
          .where({ id })
          .update(newTopicFields)
      },
}

module.exports = TopicsService