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
    <div class="container mx-auto my-4 px-4 text-xl">
    
      <p>{status}</p>
      
      {/* day:
      <input type="text" value={day} onChange={(ev) => setDay(ev.target.value)} /> */}
      Nazwa:
      <input type="text" value={name} onChange={(ev) => setName(ev.target.value)} />
      kWh:
      <input type="number" value={power} onChange={(ev) => setPower(Number(ev.target.value))} />
      <button onClick={AddUsage}>dodaj</button>
      
    </div>
  )
}

export default AddUsageForm
