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
  const [devices, setDevices] = useState('')

  // Fetch usage data from the database using useLiveQuery
  const usage = useLiveQuery(async () => {
    const usageData = await db.usage.where('name').equalsIgnoreCase(name).toArray()
    // console.log("test keys ",await db.usage.orderBy('name').keys())
    setDevices(Array.from(new Set(await db.usage.orderBy('name').keys())))
    console.log("devices ",devices)


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
          const hourRange = `${hourIndex}:00-${hourIndex + 1}:00`
          timeActive[hourRange] = true
        }
      })
      updatedUsageData.push({ name: name, power: '', day: dayName, timeActive })
    })

    // Update or add data in the database
    await db.usage.where('name').equalsIgnoreCase(name).delete()
    await db.usage.bulkAdd(updatedUsageData)
    console.log('Database updated successfully:', updatedUsageData)
  }

  return (
    <div>
     <div className="sm:col-span-3">
        <label htmlFor="applianceName" className="block text-sm font-medium leading-6 text-gray-900">
          urządzenie
        </label>
        <div className="mt-2">
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
              <option key={index} value={device}>{device}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="container mx-auto px-12 py-8">
        <button
          onClick={handleUpdateDatabase}
          className="mt-4 rounded bg-blue-500 px-4 py-2 font-semibold text-white"
        >
          save to db
        </button>

        <div className="grid grid-cols-7 gap-4">
          {weekState.map((dayState, dayIndex) => (
            <div key={dayIndex}>
              <h2>
                {
                  ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'][
                    dayIndex
                  ]
                }
              </h2>
              {dayState.map((isActive, hourIndex) => (
                <button
                  key={hourIndex}
                  onClick={() => handleHourClick(dayIndex, hourIndex)}
                  className={`w-full py-2 ${isActive ? 'bg-green-500' : 'bg-red-500'} mb-2 font-semibold text-white`}
                >
                  {hourIndex}:00 - {hourIndex + 1}:00
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
