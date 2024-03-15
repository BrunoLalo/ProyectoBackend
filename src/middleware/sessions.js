import session from 'express-session'
import config from '../config.js'

const MongoStore = import('connect-mongo').default

const store = MongoStore.create({
  mongoUrl: config.MONGO_URL,
  ttl: 60 * 60 * 24 
})

export const sessions = session({
  store,
  secret: 'Bruno123',
  resave: false,
  saveUninitialized: true
})
