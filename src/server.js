require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
// const faker = require('faker');
const { ApolloServer } = require('apollo-server');
const { typeDefs, resolvers } = require('./schema');
const { User } = require('./models');

const port = process.env.PORT || 4000;

mongoose
  .connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true }
  )
  .then(() => {
    const playground = {
      settings: {
        'editor.cursorShape': 'block',
      },
    };

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      playground,
      cors: true,
      // mocks: {
      //   User: () => ({
      //     name: faker.name.findName(),
      //     email: faker.internet.email(),
      //     updatedAt: faker.date.past(),
      //   }),
      //   Profile: () => ({
      //     handle: faker.internet.userName(),
      //     bio: faker.lorem.paragraph(),
      //     website: faker.internet.url(),
      //     location: `${faker.address.city()}, ${faker.address.stateAbbr()}`,
      //     updatedAt: faker.date.past(),
      //   }),
      //   Skill: () => ({
      //     name: faker.name.jobType(),
      //   }),
      // },
      context: async ({ req }) => {
        // get the user token from the headers
        const authorization = req.headers.authorization || '';
        const bearerLength = 'Bearer '.length;
        const token = authorization.slice(bearerLength);

        // try to retrieve a user with the token
        const user = await getUser(token);

        // add the user to the context
        return { user };
      },
    });

    server.listen({ port }).then(({ url }) => {
      console.log(`🚀  Server ready at ${url}`);
    });
  })
  .catch(console.error);

const getUser = async token => {
  const { ok, result } = await new Promise(resolve =>
    jwt.verify(token, process.env.JWT_SECRET, (err, jwtResult) => {
      if (err) {
        resolve({
          ok: false,
          result: err,
        });
      } else {
        resolve({
          ok: true,
          result: jwtResult,
        });
      }
    })
  );

  if (ok) {
    const user = await User.findOne({ _id: result.id });
    return user;
  }
  return null;
};
