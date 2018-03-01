const { GraphQLServer, PubSub } = require('graphql-yoga')

const sampleItems = [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Orange' }, { name: 'Melon' }]

const typeDefs = `
  type Query {
    items: [Item!]!
  }

  type Item {
    name: String!
  }

  type Counter {
    count: Int!
    countStr: String
  }

  type Subscription {
    counter: Counter!
  }
`

const resolvers = {
  Query: {
    items: () => sampleItems
  },
  Counter: {
    countStr: counter => `Current count: ${counter.count}`
  },
  Subscription: {
    counter: {
      subscribe: (parent, args, { pubsub }) => {
        const channel = Math.random()
          .toString(36)
          .substring(2, 15) // random channel name
        let count = 0
        setInterval(() => pubsub.publish(channel, { counter: { count: count++ } }), 2000)
        return pubsub.asyncIterator(channel)
      }
    }
  }
}

const options = {
  port: process.env.SERVER_PORT || 4000,
  endpoint: '/graphql',
  subscriptions: '/subscriptions',
  playground: '/playground'
}

const pubsub = new PubSub()
const server = new GraphQLServer({ typeDefs, resolvers, context: { pubsub } })

server.start(options, ({ port }) => console.log(`Server is running on localhost:${port}`))
