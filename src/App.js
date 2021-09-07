import React, { useState } from "react";
import { HeadCounter } from "./Components/Counter";
import { FabButton } from "./Components/FabButton";
import Navbar from "./Components/Navbar";
import { likesCounter } from "./Services/expensiveCalculation";

import useSWR from 'swr'

import { Repository } from './Components/Repository'


const Repos = React.memo(({getRepositories}) => {
  const [items, setItems] = useState([])

  React.useEffect(() => {
    setItems(getRepositories && getRepositories.items || [])
  }, [getRepositories])

  return (
    <div className='list'>
      {items && items?.map((result) => (
        <Repository key={result.key} {...result}/>
      ))}
    </div>
  )
})

function App() {
  const [totalLikes, setTotalLikes] = useState(0);
  const [dark, setDark] = useState(false);

  const { data, error } = useSWR('https://api.github.com/search/repositories?q=facebook', async (url) => {
    const response = await fetch(url)
    const data = await response.json()


    return data
  })

  const likes = React.useMemo(() => likesCounter(totalLikes),[totalLikes]);


  const theme = React.useMemo(() => ({
    color: dark ? "#fff" : "#333",
    navbar: dark ? "#1a202c" : "#e5e7eb",
    backgroundColor: dark ? "#333" : "#fff",
  }),[dark] )

  const toogleDarkmode = () => setDark(!dark);


  return (
    <div style={theme} className="App">
      <Navbar theme={theme.navbar} toogleDarkmode={toogleDarkmode} />
      <HeadCounter likes={likes} />
      <Repos getRepositories={data}/>
      <FabButton totalLikes={totalLikes} setTotalLikes={setTotalLikes} />
    </div>
  );
}

export default App;
