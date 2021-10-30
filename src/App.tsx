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

const App = () => {
  const [record, setRecord] = useState<undefined | Record>(undefined)

  const getFile = (e: any) => {
    const fileReader = new FileReader()
    fileReader.readAsText(e.target.files[0], "UTF-8")
    fileReader.onload = (e) => {
      const recordAsString = (e.target?.result || '{}') as string
      const recordAsJSON = JSON.parse(recordAsString)
      setRecord(recordAsJSON)
    }
  }

  const createDefaultRecord = () => {
    const currentWeek = getFormattedDate(getCurrentWeek())
    const newRecord = {
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

    setRecord(newRecord)
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

  return (
    <>
      {record === undefined &&
        <div>
          <label htmlFor="uploadRecord">Upload Record</label>
          <input type="file" name="uploadRecord" accept=".json" onChange={getFile} />
          <button onClick={createDefaultRecord}>Start New Record</button>
        </div>
      }
      {record !== undefined &&
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
                          <input type="checkbox" checked={success === 1} />
                        </>
                      ))}
                    </>
                  ))}
                </>
              ))}
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default App

