import session from 'express-session'
import { MONGO_URL } from '../config.js'
import connectMongo from 'connect-mongo'

const store = connectMongo.create({
  mongoUrl: MONGO_URL,
  ttl: 60 * 60 * 24 
})

export const sessions = session({
  store,
  secret: 'Bruno123',
  resave: false,
  saveUninitialized: true
})
