This is Node.js with GraphQL and Appolo Server, it uses Postgres Databse with Sequilizer (ORM) to store Users and Messages informations.
The server accepts Query and Mutaion from React Apollo client 

### Features
- User Signup
- User login
- Create message
- Delete message

### Screenshots ###
- doc/playground_screenshots/signIn.png
- doc/playground_screenshots/create_message.png
- doc/playground_screenshots/list_users.png
### Main Components

#### 1) index.js
- Create ApolloServer 
listen to http://localhost:8000/graphql')
- Create context object with 
	authenticate token, models, ...
- Create a few users 
- Create messages belong to users

#### 2) schema
##### user
- define query for find users
- define mutation to create users
##### message
- define query for find messages
- define mutation to create message
- define mutation to delete message
#### 3) resolvers
#### authorization
Check role for "ADMIN" or "USER"
#### user 
Use Sequlize (ORM) to communicate with Postgres database
##### user Query
- use models.UserfindByIPk(id) to find user with id
- use models.UserfindAll() for all users
##### user Mutation
- signUp: username, email, password
- signIn: username and password
#### 4) models
Define user schema in Postgres database
##### User
username, email, password, role
User.hasMany messages
##### Message
text, userId
Message.belongsTo Use
#### 5) loaders
Uses to preload users into local cache to reduce number of requests to database