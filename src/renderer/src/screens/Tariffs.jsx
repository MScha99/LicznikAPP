import { useState, useEffect } from 'react'
import db from '../services/db.jsx'
import { useLiveQuery } from 'dexie-react-hooks'

export default function Tariffs() {
  const [tariffs, setTariffs] = useState(
    new Array(7).fill(null).map(() => [{ fromHour: '', toHour: '', price: '' }])
  )
  const [name, setName] = useState('')
  const [existingTariffs, setExistingTariffs] = useState([])
  const [validationErrors, setValidationErrors] = useState([])

  const allTariffs = useLiveQuery(async () => {
    const tariffData = await db.tariff.toArray()
    return tariffData
  }, [])

  useEffect(() => {
    if (allTariffs) {
      const uniqueTariffNames = Array.from(new Set(allTariffs.map((tariff) => tariff.name)))
      setExistingTariffs(uniqueTariffNames)
    }
  }, [allTariffs])

  const handleTariffChange = (dayIndex, tariffIndex, field, value) => {
    const updatedTariffs = [...tariffs]
    const tariff = updatedTariffs[dayIndex][tariffIndex]

    if (field === 'toHour' && value <= tariff.fromHour) {
      setValidationErrors(['To hour must be greater than from hour'])
    } else {
      setValidationErrors([])
    }

    if (field === 'toHour') {
      const conflictingSlot = updatedTariffs[dayIndex].find(
        (existingTariff, index) =>
          index !== tariffIndex &&
          existingTariff.fromHour < value &&
          existingTariff.toHour > tariff.fromHour
      )
      if (conflictingSlot) {
        setValidationErrors(['Time slot conflicts with existing time slots on the same day'])
      } else {
        setValidationErrors([])
      }
    }

    tariff[field] = value
    setTariffs(updatedTariffs)
  }

  const addTariffSlot = (dayIndex) => {
    const updatedTariffs = [...tariffs]
    updatedTariffs[dayIndex].push({ fromHour: '', toHour: '', price: '' })
    setTariffs(updatedTariffs)
  }

  const handleUpdateDatabase = async () => {
    const updatedTariffData = []
    tariffs.forEach((dayTariffs, dayIndex) => {
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
      dayTariffs.forEach((tariff) => {
        if (tariff.fromHour && tariff.toHour && tariff.price) {
          const hourRange = `${String(tariff.fromHour).padStart(2, '0')}-${String(tariff.toHour).padStart(2, '0')}`
          timeActive[hourRange] = tariff.price
        }
      })
      updatedTariffData.push({ name: name, day: dayName, timeActive })
    })

    await db.tariff.where('name').equalsIgnoreCase(name).delete()
    await db.tariff.bulkAdd(updatedTariffData)
    console.log('Database updated successfully:', updatedTariffData)
  }

  const handleTariffSelection = async (selectedName) => {
    setName(selectedName)
    const selectedTariff = await db.tariff.where('name').equalsIgnoreCase(selectedName).toArray()
    const updatedTariffs = new Array(7).fill(null).map(() => [])
    selectedTariff.forEach((tariff) => {
      const dayIndex = [
        'Poniedziałek',
        'Wtorek',
        'Środa',
        'Czwartek',
        'Piątek',
        'Sobota',
        'Niedziela'
      ].indexOf(tariff.day)
      Object.entries(tariff.timeActive).forEach(([hourRange, price]) => {
        const [fromHour, toHour] = hourRange.split('-').map((time) => time.split(':')[0])
        updatedTariffs[dayIndex].push({ fromHour, toHour, price })
      })
    })
    setTariffs(updatedTariffs)
  }

  return (
    <div class="container mx-auto my-4 px-4">
      <div className="sm:col-span-3">
        <label htmlFor="tariffName" className="block text-sm font-medium leading-6 text-gray-900">
         Nazwa nowoutworzonej taryfy
        </label>
        <div className="mt-2">
          <input
            type="text"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            id="tariffName"
            name="tariffName"
            autoComplete="tariff-name"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
          />
        </div>
      </div>

      <div className="mt-4 sm:col-span-3">
        <label
          htmlFor="existingTariffs"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Wybierz istniejącą taryfę
        </label>
        <div className="mt-2">
          <select
            id="existingTariffs"
            name="existingTariffs"
            onChange={(e) => handleTariffSelection(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
          >
            <option value="">---</option>
            {existingTariffs.map((tariffName, index) => (
              <option key={index} value={tariffName}>
                {tariffName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="container mx-auto px-12 py-8">
        {/* Display validation errors */}
        {validationErrors.length > 0 && (
          <div className="mb-4 text-red-500">
            {validationErrors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
        {tariffs.map((dayTariffs, dayIndex) => (
          <div key={dayIndex}>
            <h2>
              {
                ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'][
                  dayIndex
                ]
              }
            </h2>
            {dayTariffs.map((tariff, tariffIndex) => (
              <div key={tariffIndex} className="mb-4 flex space-x-4">
                <input
                  type="text"
                  placeholder="Od godziny"
                  value={tariff.fromHour}
                  onChange={(e) => {
                    const inputValue = e.target.value
                    const sanitizedValue = inputValue.replace(/\D/g, '').slice(0, 2)
                    if (
                      sanitizedValue &&
                      parseInt(sanitizedValue) >= 0 &&
                      parseInt(sanitizedValue) <= 23
                    ) {
                      handleTariffChange(dayIndex, tariffIndex, 'fromHour', sanitizedValue)
                    } else {
                      handleTariffChange(dayIndex, tariffIndex, 'fromHour', '')
                    }
                  }}
                  className="w-1/4 rounded border p-2"
                />
                <input
                  type="text"
                  placeholder="Do godziny"
                  value={tariff.toHour}
                  onChange={(e) => {
                    const inputValue = e.target.value
                    const sanitizedValue = inputValue.replace(/\D/g, '').slice(0, 2)
                    if (
                      sanitizedValue &&
                      parseInt(sanitizedValue) >= 0 &&
                      parseInt(sanitizedValue) <= 23
                    ) {
                      handleTariffChange(dayIndex, tariffIndex, 'toHour', sanitizedValue)
                    } else {
                      handleTariffChange(dayIndex, tariffIndex, 'toHour', '')
                    }
                  }}
                  className="w-1/4 rounded border p-2"
                />

                <input
                  type="number"
                  placeholder="koszt kWH "
                  value={tariff.price}
                  onChange={(e) =>
                    handleTariffChange(dayIndex, tariffIndex, 'price', e.target.value)
                  }
                  className="w-1/4 rounded border p-2"
                />
              </div>
            ))}
            <button
              onClick={() => addTariffSlot(dayIndex)}
              className="mb-4 mt-2 rounded bg-green-500 px-4 py-2 font-semibold text-white"
            >
              Dodaj kolejny zakres czasowy
            </button>
          </div>
        ))}

        <button
          onClick={handleUpdateDatabase}
          className="mt-4 rounded bg-blue-500 px-4 py-2 font-semibold text-white"
        >
          Save to DB
        </button>

        <button
          onClick={async () => {
            if (name) {
              if (window.confirm('Are you sure you want to delete this tariff?')) {
                await db.tariff.where('name').equalsIgnoreCase(name).delete()
                setName('')
                setTariffs(
                  new Array(7).fill(null).map(() => [{ fromHour: '', toHour: '', price: '' }])
                )
                console.log('Tariff deleted successfully')
              }
            } else {
              alert('Please select a tariff to delete')
            }
          }}
          className="mt-4 rounded bg-red-500 px-4 py-2 font-semibold text-white"
        >
          Delete Tariff
        </button>
      </div>
    </div>
  )
}
