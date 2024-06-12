import { useState, useEffect } from 'react'
import '../../index.css'
import db from '../services/db.jsx'
import { useLiveQuery } from 'dexie-react-hooks'

function Calendar() {
  // Initialize state for all 7 days, each containing an array for 24 hours
  const [weekState, setWeekState] = useState(
    new Array(7).fill(null).map(() => new Array(24).fill(false))
  )
  const [name, setName] = useState('')
  const [power, setPower] = useState('')
  const [devices, setDevices] = useState([])

  // Fetch usage data from the database using useLiveQuery
  const usage = useLiveQuery(async () => {
    const usageData = await db.usage.where('name').equalsIgnoreCase(name).toArray()
    setDevices(Array.from(new Set(await db.usage.orderBy('name').keys())))
    return usageData
  }, [name])

  // Update weekState based on the fetched usage data
  useEffect(() => {
    if (usage) {
      const updatedWeekState = new Array(7).fill(null).map(() => new Array(24).fill(false))
      usage.forEach((dayData) => {
        const dayIndex = [
          'Poniedziałek',
          'Wtorek',
          'Środa',
          'Czwartek',
          'Piątek',
          'Sobota',
          'Niedziela'
        ].indexOf(dayData.day)
        const { timeActive } = dayData
        Object.entries(timeActive).forEach(([hourRange, isActive]) => {
          const [startHour] = hourRange.split('-')
          const hourIndex = parseInt(startHour)
          updatedWeekState[dayIndex][hourIndex] = isActive
        })
      })
      setWeekState(updatedWeekState)
    }
  }, [usage])

  const handleHourClick = (dayIndex, hourIndex) => {
    const updatedWeekState = [...weekState]
    updatedWeekState[dayIndex][hourIndex] = !updatedWeekState[dayIndex][hourIndex]
    setWeekState(updatedWeekState)
  }

  const handleColumnToggle = (dayIndex) => {
    const updatedWeekState = [...weekState]
    const allSelected = updatedWeekState[dayIndex].every((isActive) => isActive)
    updatedWeekState[dayIndex] = updatedWeekState[dayIndex].map(() => !allSelected)
    setWeekState(updatedWeekState)
  }

  const formatHour = (hour) => {
    return hour.toString().padStart(2, '0') + ':00'
  }

  const handleUpdateDatabase = async () => {
    const updatedUsageData = []
    weekState.forEach((dayState, dayIndex) => {
      const dayName = [
        'Poniedziałek',
        'Wtorek',
        'Środa',
        'Czwartek',
        'Piątek',
        'Sobota',
        'Niedziela'
      ][dayIndex]
      const timeActive = {}
      dayState.forEach((isActive, hourIndex) => {
        if (isActive) {
          const fromHour = String(hourIndex).padStart(2, '0')
          const toHour = String(hourIndex + 1).padStart(2, '0')
          const hourRange = `${fromHour}-${toHour}`
          timeActive[hourRange] = true
        }
      })
      updatedUsageData.push({ name: name, power: '', day: dayName, timeActive })
    })

    // Update or add data in the database
    await db.usage.where('name').equalsIgnoreCase(name).delete()
    // Convert timeActive to store only hours without minutes
    const updatedUsageDataWithoutMinutes = updatedUsageData.map((data) => ({
      ...data,
      timeActive: Object.entries(data.timeActive).reduce((acc, [hourRange, isActive]) => {
        const [fromHour] = hourRange.split('-')
        acc[fromHour] = isActive
        return acc
      }, {})
    }))
    await db.usage.bulkAdd(updatedUsageDataWithoutMinutes)
    console.log('Database updated successfully:', updatedUsageDataWithoutMinutes)
  }

  const handleDeleteDevice = async () => {
    if (name) {
      await db.usage.where('name').equalsIgnoreCase(name).delete()
      setWeekState(new Array(7).fill(null).map(() => new Array(24).fill(false)))
      console.log(`Device ${name} deleted successfully`)
      setName('')
    }
  }

  return (
    <div className="container mx-auto my-4 px-4 ">
 

      <div className="container mx-auto px-12 py-8 ">
        <div className="mt-2 flex items-center justify-between">
          <select
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            id="applianceName"
            name="applianceName"
            autoComplete="appliance-name"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
          >
            <option value="">Wybierz urządzenie</option>
            {devices.map((device, index) => (
              <option key={index} value={device}>
                {device}
              </option>
            ))}
          </select>
        
        <button
          onClick={handleUpdateDatabase}
          className="mt-4 rounded bg-green-400 px-4 py-2 font-semibold text-white"
        >
          Zapisz zmiany w harmonogramie
        </button>
        <button
          onClick={handleDeleteDevice}
          className="ml-4 mt-4 rounded bg-red-500 px-4 py-2 font-semibold text-white"
        >
          Usuń wybrane urządzenie
        </button>
        </div>
        <div className="my-5 grid grid-cols-7 gap-4 border-2 border-solid border-indigo-600 px-5 py-2 ">
          {weekState.map((dayState, dayIndex) => (
            <div key={dayIndex} className="text-center ">
              <div>
                <input
                  type="checkbox"
                  value=""
                  onClick={() => handleColumnToggle(dayIndex)}
                  className="ml-2 bg-yellow-500 px-2 py-1 font-semibold text-white"
                ></input>
              </div>
              <div className="py-1 ">
                <h2>
                  {
                    [
                      'Poniedziałek',
                      'Wtorek',
                      'Środa',
                      'Czwartek',
                      'Piątek',
                      'Sobota',
                      'Niedziela'
                    ][dayIndex]
                  }
                </h2>
              </div>
              {dayState.map((isActive, hourIndex) => (
                <button
                  key={hourIndex}
                  onClick={() => handleHourClick(dayIndex, hourIndex)}
                  className={`w-full py-2 ${isActive ? 'bg-green-500' : 'bg-red-500'} mb-2 font-semibold text-white`}
                >
                  {`${String(hourIndex).padStart(2, '0')}:00 - ${String(hourIndex + 1).padStart(2, '0')}:00`}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Calendar
