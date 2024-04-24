/* eslint-disable react/prop-types */
import { useState } from 'react'
import db from '../services/db.jsx'

export function AddUsageForm({day, timeActive}) {
  const [name, setName] = useState('')
  // const [day, setDay] = useState('')
  // const [timeActive, setTimeActive] = useState([])
  const [power, setPower] = useState('')
  const [status, setStatus] = useState('')

  async function AddUsage() {
    // console.log("time active:", timeActive)
    // console.log("day", day)

    try {
      const id = await db.usage.add({
        name,
        power,
        day,
        // timeActive: {'00:00-01:00':true, '01:00-02:00':false},
        timeActive
      })
      
      setStatus(`Usage for appliance ${id} successfully added.`)
      setName('')
      // setDay('')
      // setTimeActive([])
    } catch (error) {
      setStatus(`Failed: ${error}`)
    }
  }

  return (
    <div className="text-xl">
      <p>{status}</p>
      <p> usage form: </p>
      {/* day:
      <input type="text" value={day} onChange={(ev) => setDay(ev.target.value)} /> */}
      Name:
      <input type="text" value={name} onChange={(ev) => setName(ev.target.value)} />
      Power:
      <input type="number" value={power} onChange={(ev) => setPower(Number(ev.target.value))} />
      <button onClick={AddUsage}>Add</button>
      
    </div>
  )
}

export default AddUsageForm
