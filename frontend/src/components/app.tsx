import React, { useEffect, useState } from 'react'
import './app.sass'

const App = () => {
  const [data, setData] = useState<{ nums: number[] }>(null)

  useEffect(() => {
    const fetchData = async () => {
      const serviceUrl = `${location.protocol}//${location.hostname}:${location.port}/service`
      const res = await fetch(`${serviceUrl}?test=0`)
      const data = await res.json()
      setData(data)
    }
    fetchData()
  }, [])

  return (
    <div className="app">
      <h3>{!data ? 'loading...' : 'hello world!'}</h3>
      {data ? (
        <p>
          <b>data from server: </b>
          {JSON.stringify(data.nums)}
        </p>
      ) : null}
    </div>
  )
}

export default App
