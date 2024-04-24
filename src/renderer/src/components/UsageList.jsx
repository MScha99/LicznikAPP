import db from '../services/db.jsx'
import { useLiveQuery } from 'dexie-react-hooks'

// export function FriendList() {
//     const friends = useLiveQuery(() => db.friends.toArray());

export function UsageList() {
  const usage = useLiveQuery(async () => {
    //
    // Query Dexie's API
    //
    const usage = await db.usage.toArray()


 console.log("usage: ",usage)
    return usage
  })

  return (
    <div>
      
      <ul>
      {usage?.map((usage) => (
        <li key={usage.id}>
          {usage.name}, {usage.power}, {usage.day}
          {/* {console.log('timeactive:', usage.timeActive)}
          {usage.timeActive['dwa']=true}
          {console.log('timeactive:', usage.timeActive)} */}
        </li>
      ))}
    </ul>
    </div>
  )
}

export default UsageList
