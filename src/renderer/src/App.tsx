import AddFriendsForm from './components/AddFriendsForm.jsx'
import AddUsageForm from './components/AddUsageForm.jsx'
import FriendList from './components/FriendList.jsx'
import db from './services/db.jsx'
import UsageList from './components/UsageList.jsx'
import UsageGet from './components/UsageGet.jsx'
import Calendar from './components/Calendar.jsx'



function App(): JSX.Element {
  




  async function persist() {
    return (await navigator.storage) && navigator.storage.persist && navigator.storage.persist()
  }

  async function isStoragePersisted() {
    return (await navigator.storage) && navigator.storage.persisted && navigator.storage.persisted()
  }

  isStoragePersisted().then(async (isPersisted) => {
    if (isPersisted) {
      console.log(':) Storage is successfully persisted.')
    } else {
      console.log(':( Storage is not persisted.')
      console.log('Trying to persist..:')
      if (await persist()) {
        console.log(':) We successfully turned the storage to be persisted.')
      } else {
        console.log(':( Failed to make storage persisted')
      }
    }

    if (navigator.storage && navigator.storage.estimate) {
      const estimation = await navigator.storage.estimate()
      console.log(`Quota: ${estimation.quota}`)
      console.log(`Usage: ${estimation.usage}`)
    } else {
      console.error('StorageManager not found')
    }
  })

  return (
    <>
      {/* <button onClick={db.delete()}> delete db</button> */}
      {/* <AddFriendsForm />
      <FriendList minAge={'15:00'} maxAge={'16:00'} /> */}


      <AddUsageForm day={'Poniedziałek'} timeActive={{}} />
      {/* <UsageList/> */}
      <br />
      <UsageGet name={'Telewizor'} />
      {/* <Calendar/> */}
    </>
  )
}

export default App
