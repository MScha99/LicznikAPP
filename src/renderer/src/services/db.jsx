import Dexie from 'dexie'

export const db = new Dexie('myDatabase')
db.version(1).stores({
 // Primary key and indexed props
  
  usage: '++id, name, power, day, *timeActive',

  tariff: '++id, name, day,  *timeActive'
})

export default db