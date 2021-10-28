import { useState } from "react"

type Record = {
  thing?: string
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
    setRecord({})
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
    </>
  )
}

export default App

