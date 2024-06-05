import React from 'react'
import AddUsageForm from '../components/AddUsageForm.jsx'
import Calendar from '../components/Calendar.jsx'

export default function Devices() {




  // async function persist() {
  //   return (await navigator.storage) && navigator.storage.persist && navigator.storage.persist()
  // }

  // async function isStoragePersisted() {
  //   return (await navigator.storage) && navigator.storage.persisted && navigator.storage.persisted()
  // }

  // isStoragePersisted().then(async (isPersisted) => {
  //   if (isPersisted) {
  //     console.log(':) Storage is successfully persisted.')
  //   } else {
  //     console.log(':( Storage is not persisted.')
  //     console.log('Trying to persist..:')
  //     if (await persist()) {
  //       console.log(':) We successfully turned the storage to be persisted.')
  //     } else {
  //       console.log(':( Failed to make storage persisted')
  //     }
  //   }

  //   if (navigator.storage && navigator.storage.estimate) {
  //     const estimation = await navigator.storage.estimate()
  //     console.log(`Quota: ${estimation.quota}`)
  //     console.log(`Usage: ${estimation.usage}`)
  //   } else {
  //     console.error('StorageManager not found')
  //   }
  // })







  return (
    <>



    <AddUsageForm day={'Poniedziałek'} timeActive={{}} />
    <Calendar/>
    </>
  )
}
