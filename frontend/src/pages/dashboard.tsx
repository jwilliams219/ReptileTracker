import { useEffect, useState, KeyboardEvent } from "react"
import { Api } from './../lib/api'
import { Reptile } from './reptile'

interface Record {
  id: number;
  reptile: string;
  type: string;
  description: string;
}

interface Reptile {
  id: number;
  species: string;
  name: string;
  sex: string;
}

export const Dashboard  = () => {
  const [ loggedIn, setLoggedIn ] = useState(false);
  const [ token, setToken ] = useState(window.localStorage.token);
  const [userId, setUserId] = useState(window.localStorage.userId);
  const api = new Api();
  const [reptiles, setReptiles] = useState<Reptile[]>([]);
  const [schedules, setSchedules] = useState<Record[]>([]);
  const [today, setToday] = useState("");
  const [viewReptile, setViewReptile] = useState(-1);
  const [creatingNewReptile, setCreatingNewReptile] = useState(false);
  const [newReptileName, setNewReptileName] = useState("");
  const [newReptileSpecies, setNewReptileSpecies] = useState("ball_python");
  const [newReptileSex, setNewReptileSex] = useState("m");

  async function checkLogIn() {
    setToken(window.localStorage.token);
    if (token) {
        const resultBody = await api.get(`${import.meta.env.VITE_SERVER_URL}users/me`, token)
        if (resultBody.userId) {
          setLoggedIn(true);
          setUserId(resultBody.userId);
          window.localStorage.userId = userId;
        } else {
          setLoggedIn(false);
        }
    }
  }

  async function getSchedules() {
    if (loggedIn) {
      const resultBody = await api.get(`${import.meta.env.VITE_SERVER_URL}users/schedules/${userId}`, token)
      let newRecords = [];
      let day = today.toLowerCase();
      if (resultBody.records.length > 0) {
        for (let i in resultBody.records) {
          if (resultBody.records[i][day]) {
            let reptileName = ""
            for (let j in reptiles) {
              if (reptiles[j].id === resultBody.records[i].reptileId) {
                reptileName = reptiles[j].name;
              }
            }
            newRecords.push({"id": resultBody.records[i].id, "reptile": resultBody.records[i].reptileId, 
            "type": resultBody.records[i].type, "description": resultBody.records[i].description})
          }
        }
        setSchedules(newRecords);
      }
    }
  }

  async function getReptiles() {
    if (loggedIn) {
      const resultBody = await api.get(`${import.meta.env.VITE_SERVER_URL}reptiles/all`, token)
      let newReptiles = [];
      if (resultBody.reptiles.length > 0) {
        for (let i in resultBody.reptiles) {
          if (resultBody.reptiles[i].userId === userId) {
            newReptiles.push({"id": resultBody.reptiles[i].id, "species": resultBody.reptiles[i].species, 
            "name": resultBody.reptiles[i].name, "sex": resultBody.reptiles[i].sex})
          }
        }
        setReptiles(newReptiles);
      }
    }
  }

  function setDay() {
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const d = new Date();
    let day = d.getDay();
    setToday(weekday[day]);
  }

  async function createNewReptile() {
    let body = {
      species: newReptileSpecies,
      name: newReptileName,
      sex: newReptileSex,
    }
    const resultBody = await api.post(`${import.meta.env.VITE_SERVER_URL}reptiles`, token, body)
    if (resultBody.reptile) {
        location.reload();
    }
  }

  function reptilePage(reptileId: number) {
    window.localStorage.reptileId = reptileId;
    setViewReptile(reptileId);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      createNewReptile();
    }
  }

  useEffect(() => {
    setSchedules([]);
    setReptiles([]);
    checkLogIn();
    setDay();
    
  }, [])

  useEffect(() => {
    getSchedules();
    getReptiles();
    
  }, [loggedIn])

  useEffect(() => {
    let newSchedules = [...schedules];
    for (let i in newSchedules) {
      let reptileName = ""
      for (let j in reptiles) {
        if (reptiles[j].id + "" == newSchedules[i].reptile) {
            reptileName = reptiles[j].name;
          }
        }
        newSchedules[i].reptile = reptileName;
    }
    setSchedules(newSchedules);
  }, [reptiles])

  let inputErrorMessage = null;
  if (newReptileName === "") {
      inputErrorMessage = <p>Must include a valid name</p>
  }

  let newReptileForm = null;
  if (loggedIn && creatingNewReptile) {
      newReptileForm = 
      <div className="box">
            <p>Name: <input type="text" value={newReptileName} onChange={e=> setNewReptileName(e.target.value)} onKeyDown={e => handleKeyDown(e)}></input></p>
            <label>Species: </label><select onChange={e=> setNewReptileSpecies(e.target.value)}>
                <option value="ball_python">ball_python</option>
                <option value="king_snake">king_snake</option>
                <option value="corn_snake">corn_snake</option>
                <option value="redtail_boa">redtail_boa</option>
            </select><br></br>
            <label>Sex: </label><select onChange={e=> setNewReptileSex(e.target.value)}>
                <option value="m">m</option>
                <option value="f">f</option>
            </select><br></br>
            { inputErrorMessage }
            <button onClick={() => createNewReptile()}>Submit</button>
        </div>
  }

  let content = <p>Please log in</p>
  if (loggedIn && schedules.length === 0 && viewReptile === -1) {
    content = <div>
        <h3>Daily Schedule: {today}</h3>
        <p>No schedules found for today</p>
        <h3>Current Reptile List</h3>
        {
          reptiles.map((reptile) => (
            <button  key={reptile.id} onClick={() => reptilePage(reptile.id)}>
            <div>
              <h4>Name: {reptile.name}</h4>
              <p>Species: {reptile.species}</p>
              <p>Sex: {reptile.sex}</p>
            </div></button>
          ))
        }
        <button onClick={() => setCreatingNewReptile(true)}>Create New Reptile</button>
        { newReptileForm }
        </div>;
  } else if (loggedIn && viewReptile !== -1) {
    content = <Reptile />
  } else if (loggedIn) {
    content = <div>
      <h3>Daily Schedules: {today}</h3>
        {
          schedules.map((schedule) => (
            <div className="box" key={schedule.id}>
              <h4>Reptile: {schedule.reptile}</h4>
              <p>Type: {schedule.type}</p>
              <p>Description: {schedule.description}</p>
            </div>
          ))
        }
      <h3>Current Reptile List</h3>
        {
          reptiles.map((reptile) => (
            <button  key={reptile.id} onClick={() => reptilePage(reptile.id)}>
            <div>
              <h4>Name: {reptile.name}</h4>
              <p>Species: {reptile.species}</p>
              <p>Sex: {reptile.sex}</p>
            </div></button>
          ))
        }
        <button onClick={() => setCreatingNewReptile(true)}>Create New Reptile</button>
        { newReptileForm }
        </div>;
  } 


  return <div>
            { content }
        </div>
}