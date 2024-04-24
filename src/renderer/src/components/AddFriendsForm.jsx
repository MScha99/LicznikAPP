/* eslint-disable react/prop-types */
import { useState } from 'react'
import db from '../services/db.jsx'

export function AddFriendForm({ defaultAge } = { defaultAge: 21 }) {
  const [name, setName] = useState('')
  const [age, setAge] = useState(defaultAge)
  const [status, setStatus] = useState('')

  async function addFriend() {
    try {
      // Add the new friend!
      const id = await db.friends.add({
        name,
        age
      })

      setStatus(`Friend ${name} successfully added. Got id ${id}`)
      setName('')
      setAge(defaultAge)
    } catch (error) {
      setStatus(`Failed to add ${name}: ${error}`)
    }
  }

  return (
    <div className='text-xl'> 
      <p>{status}</p>
      Name:
      <input type="text" value={name} onChange={(ev) => setName(ev.target.value)} />
      Age:
      {/* <input type="number" value={age} onChange={(ev) => setAge(Number(ev.target.value))} /> */}
      <input type="time" value={age} onChange={(ev) => setAge(ev.target.value)} />
      <button onClick={addFriend}>Add</button>
    </div>
  )
}


export default AddFriendForm