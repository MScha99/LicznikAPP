/* eslint-disable react/prop-types */
import { useState } from 'react'
import db from '../services/db.jsx'

export function AddUsageForm({ day, timeActive }) {
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
    <div class="container mx-auto my-4 px-4 text-xl ">
      <div className="container mx-auto px-12 py-8 ">
        {/* <p>{status}</p> */}

        {/* day:
      <input type="text" value={day} onChange={(ev) => setDay(ev.target.value)} /> */}

        <input
          type="text"
          value={name}
          placeholder="Nazwa urządzenia"
          className="mx-2 p-2 border-2 border-solid"
          onChange={(ev) => setName(ev.target.value)}
        />

        <input
          type="number"
          value={power}
          placeholder="Moc"
          className="mx-2 p-2 border-2 border-solid"
          onChange={(ev) => setPower(Number(ev.target.value))}
        />
        <button className="mt-4 rounded bg-blue-500 px-4 py-2 font-semibold text-white"onClick={AddUsage}>Dodaj urządzenie</button>
      </div>
    </div>
  )
}

export default AddUsageForm
