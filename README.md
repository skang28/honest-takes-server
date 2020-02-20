# Honest Takes

[Live App](https://honest-takes-app.skang28.now.sh/)


## API Documentation

### Topics
#### GET /topics
Lists all topics that were used for the app's daily topic with the live daily topic being the most recent one.

### Posts
#### GET /posts
Lists all posts created on app.

#### POST /posts
Creates a new post.

#### GET /posts/post_id
Retrieves an individual post.

#### DELETE /posts/post_id
Deletes an individual post.

#### PATCH /posts/post_id
Updates an individual post.

### Comments
#### GET /comments
Lists all comments created on app.

#### POST /comments
Creates a new comment.

#### GET /comments/comment_id
Retrieves an individual comment.

#### DELETE /comments/comment_id
Deletes an individual comment.

#### PATCH /comments/comment_id
Updates an individual comment.

## Technology Used
Javascript, Node, Express, PostgreSQL
