import {observable, computed, action} from 'mobx';
import { Session } from '../Components/OldSessionList';

function getTime(): number {
  return Date.now() / 1000;
}

// Used for differentiating between viewing live data and old data
export enum ViewState {
  Recording,
  Viewing,
}

export interface SensorData {
  time: number;
  temperature: number;
  pressure: number;
  height: number;
  accelX: number;
  accelY: number;
  accelZ: number;
}

export default class DataStore {
  constructor() {
    // Fetch the session that the server is currently configured for
    fetch("/api/session").then(async (reponse)=> {
      this.session = Number(await reponse.text());
      console.log(this.session)
    })
  }
 
  @observable viewState: ViewState = ViewState.Recording;

  // Handle modals
  @observable newSessionModal: boolean = false;
  @observable oldSessionModal: boolean = false;

  // Telemetry
  @observable data: SensorData[] = [];
  @observable session: number = -1;

  // Handle graphs
  recordBegin: number = getTime();
  lastUpdate: number = getTime();
  updateGraphs?: (data: SensorData)=>void = undefined;

  @action openNewSessionModal() {
    this.newSessionModal = true;
  }

  ParseSensorData(elem: any): SensorData {
    return {
      time: new Date(elem.date).getTime()* 0.001 - this.recordBegin,
      temperature: elem.temperature,
      pressure: elem.pressure,
      height: Math.random()*10,
      accelX: elem.accelx,
      accelY: elem.accely,
      accelZ: elem.accelz
    }
  }

  // Fetches any data that was added since last update
  @action async FetchSensorData() {
    (await fetch("/api/date?date="+this.lastUpdate)).json().then((response) => {
      for(let elem of response) {
        // We need to parse the sensordata into the SensorData structure
        let sensordata: SensorData = this.ParseSensorData(elem);

        // Add data to list and update graphs
        this.data.push(sensordata);
        if(this.updateGraphs != undefined)
          this.updateGraphs(sensordata);
        this.lastUpdate = getTime();
      }
    }).catch((error) => {
      throw "ERROR(fetching sensordata):" + error;
    });
  }

  async FetchSessionList(): Promise<Session[]> {
    let sessions: Session[] = [];
    let response = await (await fetch("/api/sessions")).json();

    for(let elem of response) {
      let sessionData: Session = {
        id: elem.session,
        start: new Date(elem.min)
      }
      sessions.push(sessionData);
    }
    return sessions;
  }
}