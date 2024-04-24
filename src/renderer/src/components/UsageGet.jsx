import db from '../services/db.jsx'
import { useLiveQuery } from 'dexie-react-hooks'

export function UsageGet({ name }) {
  const usage = useLiveQuery(async () => {
    const usage = await db.usage.where('name').equalsIgnoreCase(name).toArray()

    console.log('usageget: ', usage)
    return usage
  })

  return (
    <div>
      <ul>
        {usage?.map((usageItem) => (
          <li key={usageItem.id}>
            {usageItem.name}, {usageItem.power}, {usageItem.day},{' '}
            {Object.entries(usageItem.timeActive).map(([hourRange, isActive]) => (
              <span key={hourRange}>
                {hourRange}: {isActive ? 'true' : 'false'}{' '}
              </span>
            ))}
          </li>
        ))}
      </ul>
    </div>
  )



}

export default UsageGet
