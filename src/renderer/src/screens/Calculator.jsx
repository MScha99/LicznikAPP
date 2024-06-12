import React, { useState, useEffect } from 'react'
import db from '../services/db'
import { useLiveQuery } from 'dexie-react-hooks'

function Calculator() {
  const [totalCosts, setTotalCosts] = useState({})
  const [lowestCostTariff, setLowestCostTariff] = useState(null)

  const usageData = useLiveQuery(async () => {
    const data = await db.usage.toArray()
    return data
  }, [])

  const tariffData = useLiveQuery(async () => {
    const data = await db.tariff.toArray()
    return data.map((tariff) => {
      const formattedTimeActive = {}
      Object.entries(tariff.timeActive).forEach(([hourRange, price]) => {
        const [startHour, endHour] = hourRange.split('-')
        for (let i = parseInt(startHour); i <= parseInt(endHour); i++) {
          formattedTimeActive[`${String(i).padStart(2, '0')}`] = price
        }
      })
      return { ...tariff, timeActive: formattedTimeActive }
    })
  }, [])

  useEffect(() => {
    if (usageData && tariffData) {
      const newTotalCosts = {};
      tariffData.forEach((tariff) => {
        let total = 0;
        usageData.forEach((usage) => {
          Object.entries(usage.timeActive).forEach(([hour, isActive]) => {
            if (isActive) {
              const dayTariff = tariffData.find(
                (t) => t.name === tariff.name && t.day === usage.day
              );
              if (dayTariff && dayTariff.timeActive[hour]) {
                total += parseFloat(dayTariff.timeActive[hour]);
              }
            }
          });
        });
        newTotalCosts[tariff.name] = total * 4; // Multiply by 4
      });
      setTotalCosts(newTotalCosts);
  
      // Find tariff with lowest total cost
      let lowestCost = Infinity;
      let lowestCostTariffName = null;
      Object.entries(newTotalCosts).forEach(([tariffName, cost]) => {
        if (cost < lowestCost) {
          lowestCost = cost;
          lowestCostTariffName = tariffName;
        }
      });
      setLowestCostTariff(lowestCostTariffName);
    }
  }, [usageData, tariffData]);
  

  const uniqueTariffNames = tariffData
    ? Array.from(new Set(tariffData.map((tariff) => tariff.name)))
    : []

  return (
<div class="container mx-auto my-4 px-4 flex flex-col items-center justify-center text-center">
  {/* <div>
    <label htmlFor="tariffSelect">Wybierz taryfę:</label>
    <select id="tariffSelect">
      <option value="">---</option>
      {uniqueTariffNames.map((tariffName) => (
        <option key={tariffName} value={tariffName}>
          {tariffName}
        </option>
      ))}
    </select>
  </div> */}
  <h2 className="my-5 text-3xl font-bold">Opłaty dla zapisanych taryf:</h2>
  <ul className='my-5'>
    {Object.entries(totalCosts).map(([tariffName, cost]) => (
      <li key={tariffName} className="text-xl">
        {tariffName}: {cost}
      </li>
    ))}
  </ul>
  <h2 className="my-auto text-3xl ">Najkorzystniejsza taryfa: </h2>
  <h2 className="text-3xl font-bold ">{lowestCostTariff}</h2>
</div>
  )
}

export default Calculator
