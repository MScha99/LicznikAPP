import Dexie from 'dexie'

export const db = new Dexie('myDatabase')
db.version(1).stores({
  friends: '++id, name, age', // Primary key and indexed props
  
  usage: '++id, name, power, day, *timeActive'
})

export default db