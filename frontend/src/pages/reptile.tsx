import { useEffect, useState, KeyboardEvent } from "react"
import { Api } from './../lib/api'

interface Reptile {
    id: number;
    species: string;
    name: string;
    sex: string;
}

interface HusbandryRecord {
    id: number;
    time: string;
    length: number;
    weight: number;
    temperature: number;
    humidity: number;
}

interface Feeding {
    id: number;
    time: string;
    foodItem: string;
}

interface Schedule {
    id: number;
    type: string;
    description: string;
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
}

export const Reptile = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [token, setToken] = useState(window.localStorage.token);
    const [reptileId, setReptileId] = useState(-1);
    const [userId, setUserId] = useState(-1);
    const api = new Api();
    const [editReptile, setEditReptile] = useState(false);
    const [currentReptileName, setCurrentReptileName] = useState("");
    const [currentReptileSpecies, setCurrentReptileSpecies] = useState("");
    const [currentReptileSex, setCurrentReptileSex] = useState("");
    const [reptileInfo, setReptileInfo] = useState<Reptile>();
    const [feedings, setFeedings] = useState<Feeding[]>([]);
    const [husbandryRecords, setHusbandryRecords] = useState<HusbandryRecord[]>([])
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [currentNewFoodItem, setCurrentNewFoodItem] = useState("");
    const [currentNewLength, setCurrentNewLength] = useState(0);
    const [currentNewWeight, setCurrentNewWeight] = useState(0);
    const [currentNewTemperature, setCurrentNewTemperature] = useState(0);
    const [currentNewHumidity, setCurrentNewHumidity] = useState(0);
    const [creatingFeeding, setCreatingFeeding] = useState(false);
    const [creatingHusbandryRecord, setCreatingHusbandryRecord] = useState(false);
    const [creatingSchedule, setCreatingSchedule] = useState(false);
    const [currentNewType, setCurrentNewType] = useState("feed");
    const [currentNewDescription, setCurrentNewDescription] = useState("");
    const [currentNewMonday, setCurrentNewMonday] = useState(false);
    const [currentNewTuesday, setCurrentNewTuesday] = useState(false);
    const [currentNewWednesday, setCurrentNewWednesday] = useState(false);
    const [currentNewThursday, setCurrentNewThursday] = useState(false);
    const [currentNewFriday, setCurrentNewFriday] = useState(false);
    const [currentNewSaturday, setCurrentNewSaturday] = useState(false);
    const [currentNewSunday, setCurrentNewSunday] = useState(false);



    async function checkLogIn() {
        setToken(window.localStorage.token);
        if (token) {
            const resultBody = await api.get(`${import.meta.env.VITE_SERVER_URL}users/me`, token)
            if (resultBody.userId) {
              setLoggedIn(true);
              setUserId(resultBody.userId);
              setReptileId(window.localStorage.reptileId);
              window.localStorage.userId = userId;
            } else {
                setLoggedIn(false)
            }
        }
    }

    async function getFeedings() {
        const resultBody = await api.get(`${import.meta.env.VITE_SERVER_URL}reptiles/feeding/${reptileId}?reptileId=${reptileId}`, token)
        if (resultBody.feedings.length > 0) {
            let newFeedings = [];
            for (let i in resultBody.feedings) {
                newFeedings.push({id: resultBody.feedings[i].id, time: resultBody.feedings[i].createdAt.slice(0, 10), foodItem: resultBody.feedings[i].foodItem});
            }
            setFeedings(newFeedings);
        }
    }

    async function createFeeding() {
        let body = {
            reptileId: reptileId,
            foodItem: currentNewFoodItem,
        }
        const resultBody = await api.post(`${import.meta.env.VITE_SERVER_URL}reptiles/feeding/${reptileId}`, token, body)
        if (resultBody.feeding) {
            location.reload();
        }
    }

    async function getHusbandryRecords() {
        const resultBody = await api.get(`${import.meta.env.VITE_SERVER_URL}reptiles/husbandry/${reptileId}?reptileId=${reptileId}`, token)
        if (resultBody.records.length > 0) {
            let newHusbandry = [];
            for (let i in resultBody.records) {
                newHusbandry.push({id: resultBody.records[i].id, time: resultBody.records[i].createdAt.slice(0, 10), length: resultBody.records[i].length, 
                    weight: resultBody.records[i].weight, temperature: resultBody.records[i].temperature, humidity: resultBody.records[i].humidity});
            }
            setHusbandryRecords(newHusbandry);
        }
    }

    async function createHusbandryRecord() {
        let body = {} 
        body = {
            reptileId: reptileId,
            length: currentNewLength,
            weight: currentNewWeight,
            temperature: currentNewTemperature,
            humidity: currentNewHumidity,
        }
        const resultBody = await api.post(`${import.meta.env.VITE_SERVER_URL}reptiles/husbandry/${reptileId}`, token, body)
        if (resultBody.husbandry) {
            location.reload();
        }
    }

    async function getSchedules() {
        const resultBody = await api.get(`${import.meta.env.VITE_SERVER_URL}reptiles/schedule/${reptileId}?reptileId=${reptileId}`, token)
        if (resultBody.schedule.length > 0) {
            let newSchedules = [];
            for (let i in resultBody.schedule) {
                let sched = resultBody.schedule[i];
                newSchedules.push({id: sched.id, type: sched.type, description: sched.description, monday: sched.monday, tuesday: sched.tuesday,
                    wednesday: sched.wednesday, thursday: sched.thursday, friday: sched.friday, saturday: sched.saturday, sunday: sched.sunday})
            }
            setSchedules(newSchedules);
        }
    }

    async function createSchedule() {
        let body = {};
        body = {
            reptileId: reptileId,
            userId: userId,
            type: currentNewType,
            description: currentNewDescription,
            monday: currentNewMonday,
            tueday: currentNewTuesday,
            wednesday: currentNewWednesday,
            thursday: currentNewThursday,
            friday: currentNewFriday,
            saturday: currentNewSaturday,
            sunday: currentNewSunday,
        }
        const resultBody = await api.post(`${import.meta.env.VITE_SERVER_URL}reptiles/schedule/${reptileId}`, token, body)
        if (resultBody.schedule) {
            location.reload();
        }
    }

    async function getReptileInfo() {
        const resultBody = await api.get(`${import.meta.env.VITE_SERVER_URL}reptiles/all`, token)
        if (resultBody.reptiles.length > 0) {
            for (let i in resultBody.reptiles) {
                if (resultBody.reptiles[i].id == reptileId) {
                    setReptileInfo(resultBody.reptiles[i]);
                    setCurrentReptileName(resultBody.reptiles[i].name);
                    setCurrentReptileSpecies(resultBody.reptiles[i].species);
                    setCurrentReptileSex(resultBody.reptiles[i].sex);
                }
            }
        }
    }

    async function editCurrentReptile() {
        let body = {} 
        body = {
            species: currentReptileSpecies,
            name: currentReptileName,
            sex: currentReptileSex,
            id: reptileId,
        }
        const resultBody = await api.put(`${import.meta.env.VITE_SERVER_URL}reptiles/${reptileId}`, token, body)
        if (resultBody.updateReptile) {
            setCurrentReptileName(resultBody.updateReptile.name)
            setCurrentReptileSpecies(resultBody.updateReptile.species)
            setCurrentReptileSex(resultBody.updateReptile.sex)
            location.reload();
        }
    }

    async function deleteCurrentReptile() {
        const resultBody = await api.delete(`${import.meta.env.VITE_SERVER_URL}reptiles/${reptileId}?reptileId=${reptileId}`, token)
        if (resultBody.message === "Reptile deleted") {
            location.reload();
        }
    }

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
          editCurrentReptile();
        }
    }

    useEffect(() => {
        getReptileInfo();
        getFeedings();
        getHusbandryRecords();
        getSchedules();

    }, [reptileId])

    useEffect(() => {
        checkLogIn();

    }, [])


    // Show current reptile information.
    let reptileContent = <p>Loading...</p>
    if (!loggedIn) {
        reptileContent = <p>User not found</p>
    } else if (userId === -1) {
        reptileContent = <p>Reptile not found</p>
    } else if (reptileInfo){
        reptileContent = <div>
        <div className="box">
            <h3>Name: {reptileInfo.name}</h3>
            <p>Species: {reptileInfo.species}</p>
            <p>Sex: {reptileInfo.sex}</p>
        </div>
        <button onClick={() => setEditReptile(true)}>Edit</button>
        <button onClick={() => deleteCurrentReptile()}>Delete</button></div>
    }
    let inputErrorMessage = null;
    if (currentReptileName === "") {
        inputErrorMessage = <p>Invalid name</p>
    }
    let editReptileContent = null;
    if (editReptile && reptileInfo) {
        editReptileContent = 
        <div className="box">
            <p>Name: <input type="text" value={currentReptileName} onChange={e=> setCurrentReptileName(e.target.value)} onKeyDown={e => handleKeyDown(e)}></input></p>
            <label>Species: </label><select onChange={e=> setCurrentReptileSpecies(e.target.value)}>
                <option value="ball_python">ball_python</option>
                <option value="king_snake">king_snake</option>
                <option value="corn_snake">corn_snake</option>
                <option value="redtail_boa">redtail_boa</option>
            </select><br></br>
            <label>Sex: </label><select onChange={e=> setCurrentReptileSex(e.target.value)}>
                <option value="m">m</option>
                <option value="f">f</option>
            </select><br></br>
            { inputErrorMessage }
            <button onClick={() => editCurrentReptile()}>Submit</button>
        </div>
    }

    // Show current feeding information for the reptile.
    let feedingContent = null;
    if (loggedIn && feedings.length === 0) {
        feedingContent = 
        <div>
            <h3>Feedings</h3>
            <div className="box">
                <p>No feedings yet</p>
            </div>
            <button onClick={() => setCreatingFeeding(true)}>Create New Feeding</button>
        </div>
    } else if (loggedIn && feedings.length > 0) {
        feedingContent = 
        <div>
        <h3>Feedings</h3>
        {
          feedings.map((feeding) => (
            <div className="box" key={feeding.id}>
                <h4>Date: {feeding.time}</h4>
                <p>Food: {feeding.foodItem}</p>
            </div>
          ))
        }
            <button onClick={() => setCreatingFeeding(true)}>Create New Feeding</button>
        </div>;
    }
    let createFeedingContent = null;
    let inputErrorFeeding = null;
    if (currentNewFoodItem === "") {
        inputErrorFeeding = <p>Input a food item</p>
    }
    if (creatingFeeding) {
        createFeedingContent = 
        <div className="box">
            <p>Food item: <input type="text" value={currentNewFoodItem} onChange={e=> setCurrentNewFoodItem(e.target.value)}></input></p>
            { inputErrorFeeding }
            <button onClick={() => createFeeding()}>Submit</button>
        </div>
    }

    // Show the current husbandry records for the reptile.
    let husbandryContent = null;
    if (loggedIn && husbandryRecords.length === 0) {
        husbandryContent = 
        <div>
            <h3>Husbandry Records</h3>
            <div className="box">
                <p>No records yet</p>
            </div>
            <button onClick={() => setCreatingHusbandryRecord(true)}>Create New HusbandryRecord</button>
        </div>;
    } else if (loggedIn && husbandryRecords.length > 0) {
        husbandryContent = 
        <div>
        <h3>Husbandry Records</h3>
        {
          husbandryRecords.map((husbandryRecord) => (
            <div className="box" key={husbandryRecord.id}>
                <h4>Date: {husbandryRecord.time}</h4>
                <p>Length: {husbandryRecord.length}</p>
                <p>Weight: {husbandryRecord.weight}</p>
                <p>Temperature: {husbandryRecord.temperature}</p>
                <p>Humidity: {husbandryRecord.humidity}</p>
            </div>
          ))
        }
            <button onClick={() => setCreatingHusbandryRecord(true)}>Create New HusbandryRecord</button>
        </div>;
    }
    let createHusbandryContent = null;
    let inputErrorRecord = null;
    if (currentNewLength === 0 && currentNewWeight === 0 && currentNewTemperature === 0 && currentNewHumidity === 0) {
        inputErrorRecord = <p>Fill in all values</p>
    }
    if (creatingHusbandryRecord) {
        createHusbandryContent =
        <div className="box">
            <p>Reptile length: <input type="text" value={currentNewLength} onChange={e=> setCurrentNewLength(Number(e.target.value))}></input></p>
            <p>Reptile weight: <input type="text" value={currentNewWeight} onChange={e=> setCurrentNewWeight(Number(e.target.value))}></input></p>
            <p>Temperature: <input type="text" value={currentNewTemperature} onChange={e=> setCurrentNewTemperature(Number(e.target.value))}></input></p>
            <p>Humidity: <input type="text" value={currentNewHumidity} onChange={e=> setCurrentNewHumidity(Number(e.target.value))}></input></p>
            { inputErrorRecord }
            <button onClick={() => createHusbandryRecord()}>Submit</button>
        </div>
    }

    // Show the current schedules for the reptile.
    let schedulesContent = null;
    if (loggedIn && schedules.length === 0) {
        schedulesContent = 
        <div>
            <h3>Schedules</h3>
            <div className="box">
                <p>No schedules yet</p>
            </div>
            <button onClick={() => setCreatingSchedule(true)}>Create New Schedule</button>
        </div>;
    } else if (loggedIn && husbandryRecords.length > 0) {
        schedulesContent = 
        <div>
            <h3>Schedules</h3>
            <div>
                {
                    schedules.map((schedule) => (
                        <div className="box" key={schedule.id}>
                            <h4>Days: <span>{schedule.monday ? "Mon, " : ""}</span>
                                <span>{schedule.tuesday ? "Tue, " : ""}</span>
                                <span>{schedule.wednesday ? "Wed, " : ""}</span>
                                <span>{schedule.thursday ? "Thu, " : ""}</span>
                                <span>{schedule.friday ? "Fri, " : ""}</span>
                                <span>{schedule.saturday ? "Sat, " : ""}</span>
                                <span>{schedule.sunday ? "Sun " : ""}</span>
                            </h4>
                            <p>Type: {schedule.type}</p>
                            <p>Description: {schedule.description}</p>
                        </div>
                    ))
                }
            <button onClick={() => setCreatingSchedule(true)}>Create New Schedule</button>
            </div>
        </div>
    }
    let createScheduleContent = null;
    let inputErrorSchedule = null;
    if (!currentNewMonday && !currentNewTuesday && !currentNewWednesday && !currentNewThursday && !currentNewFriday && !currentNewSaturday && !currentNewSunday) {
        inputErrorSchedule = <p>You must choose at least 1 day for the schedule.</p>
    }
    if (creatingSchedule) {
        createScheduleContent = 
        <div className="box">
            <label>Type: </label><select onChange={e=> setCurrentNewType(e.target.value)}>
                <option value="feed">feed</option>
                <option value="record">record</option>
                <option value="clean">clean</option>
            </select><br></br>
            <p>Description: <input type="text" value={currentNewDescription} onChange={e=> setCurrentNewDescription(e.target.value)} ></input></p>
            <label>Monday: </label><select onChange={e=> setCurrentNewMonday(e.target.value === "true")}>
                <option value="false">No</option>
                <option value="true">Yes</option>
            </select><br></br>
            <label>Tuesday: </label><select onChange={e=> setCurrentNewTuesday(e.target.value === "true")}>
                <option value="false">No</option>
                <option value="true">Yes</option>
            </select><br></br>
            <label>Wednesday: </label><select onChange={e=> setCurrentNewWednesday(e.target.value === "true")}>
                <option value="false">No</option>
                <option value="true">Yes</option>
            </select><br></br>
            <label>Thursday: </label><select onChange={e=> setCurrentNewThursday(e.target.value === "true")}>
                <option value="false">No</option>
                <option value="true">Yes</option>
            </select><br></br>
            <label>Friday: </label><select onChange={e=> setCurrentNewFriday(e.target.value === "true")}>
                <option value="false">No</option>
                <option value="true">Yes</option>
            </select><br></br>
            <label>Saturday: </label><select onChange={e=> setCurrentNewSaturday(e.target.value === "true")}>
                <option value="false">No</option>
                <option value="true">Yes</option>
            </select><br></br>
            <label>Sunday: </label><select onChange={e=> setCurrentNewSunday(e.target.value === "true")}>
                <option value="false">No</option>
                <option value="true">Yes</option>
            </select><br></br>
            { inputErrorSchedule }
            <button onClick={() => createSchedule()}>Submit</button>
        </div>
    }

    return <div>
            {reptileContent}
            {editReptileContent}
            {feedingContent}
            {createFeedingContent}
            {husbandryContent}
            {createHusbandryContent}
            {schedulesContent}
            {createScheduleContent}
        </div>
}