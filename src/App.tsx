import { useState } from "react"

type Settings = {
  startDate: string
}

type Tasks = {
  [key: string]: number[]
}

type Dailies = {
  [key: string]: Tasks
}

type Record = {
  lastWeek: string
  completed: {
    dailies: Dailies
  }
  inProgress: {
    dailies: Dailies
  }
  settings?: Settings

}

function getFormattedDate(date: Date) {
  let year = date.getFullYear();
  let month = (1 + date.getMonth()).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');

  return month + '/' + day + '/' + year;
}

const getCurrentWeek = () => {
  let prevMonday = new Date();
  prevMonday.setDate(prevMonday.getDate() - (prevMonday.getDay() + 6) % 7);
  prevMonday.setHours(0)
  prevMonday.setMinutes(0)
  prevMonday.setSeconds(0)
  return prevMonday
}

const defaultRecord = () => {
  const currentWeek = getFormattedDate(getCurrentWeek())
  return {
    lastWeek: currentWeek,
    settings: {
      startDate: new Date().toUTCString()
    },
    completed: {
      dailies: {
      },
    },
    inProgress: {
      dailies: {
        [currentWeek]: {
        },
      },
    }
  }
}

const App = () => {
  const [recordChosen, setRecordChosen] = useState(false)
  const [record, setRecord] = useState<Record>(defaultRecord())
  const [createDailyModalVisible, setCreateDailyModalVisible] = useState(false)
  const [newTask, setNewTask] = useState('')

  const getFile = (e: any) => {
    const fileReader = new FileReader()
    fileReader.readAsText(e.target.files[0], "UTF-8")
    fileReader.onload = (e) => {
      const recordAsString = (e.target?.result || '{}') as string
      const recordAsJSON = JSON.parse(recordAsString)
      setRecord(recordAsJSON)
    }
  }

  const maybeAddInProgressWeeks = (record: Record) => {
    let prevMonday = getCurrentWeek()
    let lastWeekRecorded = new Date(record.lastWeek)
    while (getFormattedDate(lastWeekRecorded) !== getFormattedDate(prevMonday)) {
      const lastWeekDailies = record.inProgress.dailies[getFormattedDate(lastWeekRecorded)]
      lastWeekRecorded.setDate(lastWeekRecorded.getDate() + 7)
      record.inProgress.dailies[getFormattedDate(lastWeekRecorded)] = lastWeekDailies
    }
    return record
  }

  const createNewDaily = () => {
    if (newTask.length === 0) return
    const recordCopy = record
    recordCopy.inProgress.dailies[getFormattedDate(getCurrentWeek())][newTask] = [0, 0, 0, 0, 0, 0, 0]
    setRecord(recordCopy)
    setCreateDailyModalVisible(false)
  }

  return (
    <>
      {!recordChosen &&
        <div>
          <label htmlFor="uploadRecord">Upload Record</label>
          <input type="file" name="uploadRecord" accept=".json" onChange={getFile} />
          <button onClick={() => setRecordChosen(true)}>Start New Record</button>
        </div>
      }
      {recordChosen &&
        <div>
          <div>
            <div>Dailies</div>
            <div>Weeklies</div>
          </div>
          <div>
            <div></div>
            <hr />
            <div></div>
            <hr></hr>
            <div>
              {Object.entries(record.inProgress.dailies).map(([key, value]) => (
                <>
                  <div>{key}</div>
                  {Object.entries(value).map(([key, value]) => (
                    <>
                      <div>{key}</div>
                      {value.map((success) => (
                        <>
                          <input type="checkbox" checked={success === 1} readOnly />
                        </>
                      ))}
                    </>
                  ))}
                </>
              ))}
            </div>
            <button onClick={() => setCreateDailyModalVisible(true)}>add a new daily</button>
          </div>
        </div>
      }
      {createDailyModalVisible && (
        <div>
          <input autoFocus type='text' onChange={(event) => setNewTask(event?.target.value)} />
          <button onClick={createNewDaily}>Create New Daily</button>
        </div>
      )}
    </>
  )
}

export default App

