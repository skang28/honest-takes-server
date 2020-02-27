// PostsService set up for CRUD operations.
const PostsService = {
    getAllPosts(knex) {
        return knex.select('*').from('posts')
    },
    insertPost(knex, newPost) {
        return knex
          .insert(newPost)
          .into('posts')
          .returning('*')
          .then(rows => {
            return rows[0]
          })
      },
      getById(knex, id) {
        return knex.from('posts').select('*').where('id', id).first()
      },
      deletePost(knex, id) {
        return knex('posts')
          .where({ id })
          .delete()
      },
      updatePost(knex, id, newPostFields) {
        return knex('posts')
          .where({ id })
          .update(newPostFields)
      },
}

module.exports = PostsService