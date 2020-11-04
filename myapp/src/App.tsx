import * as React from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import { Line, defaults } from 'react-chartjs-2'

import { action, computed, observable } from 'mobx'
import { inject, observer, Provider } from 'mobx-react'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

import { GraphPanel } from './Components/GraphView'
import { Graph } from './Components/Graph'
import Modal from './Components/Modal'
import OldSessionList, { Session } from './Components/OldSessionList'
import DataStore, { SensorData, ViewState } from './Stores/DataStore'

interface Props {
    data: DataStore
}

@inject('data')
@observer
class App extends React.Component<Props> {
    tempGraph: React.RefObject<Line> = React.createRef()
    trykGraph: React.RefObject<Line> = React.createRef()
    højdeGraph: React.RefObject<Line> = React.createRef()
    accelGraph: React.RefObject<Line> = React.createRef()

    constructor(props: Props) {
        super(props)
        this.props.data.updateGraphs = this.updateGraphs

        // Poll server every 1/2 second for new data
        setInterval(async () => {
            // If we are only viewing data, we should not fetch any new data
            if (this.props.data.viewState == ViewState.Viewing) return

            // This fetches the data and has an unfortunate sideeffect of updating the graphs
            await this.props.data.FetchSensorData()
        }, 500)
    }

    // prettier-ignore
    updateGraphs = (data: SensorData) => {
        // Push new data to graphs
        this.tempGraph.current?.chartInstance.data.datasets[0].data.push ({x: data.time, y: data.temperature})
        this.trykGraph.current?.chartInstance.data.datasets[0].data.push ({x: data.time, y: data.pressure})
        this.højdeGraph.current?.chartInstance.data.datasets[0].data.push({x: data.time, y: data.height})
        this.accelGraph.current?.chartInstance.data.datasets[0].data.push({x: data.time, y: data.accelX})
        this.accelGraph.current?.chartInstance.data.datasets[1].data.push({x: data.time, y: data.accelY})
        this.accelGraph.current?.chartInstance.data.datasets[2].data.push({x: data.time, y: data.accelZ})

        // If we have too many elements, we should remove the last ones
        if (this.props.data.data.length > 50) {
            this.tempGraph.current?.chartInstance.data.datasets[0].data.shift()
            this.trykGraph.current?.chartInstance.data.datasets[0].data.shift()
            this.højdeGraph.current?.chartInstance.data.datasets[0].data.shift()
            this.accelGraph.current?.chartInstance.data.datasets[0].data.shift()
            this.accelGraph.current?.chartInstance.data.datasets[1].data.shift()
            this.accelGraph.current?.chartInstance.data.datasets[2].data.shift()
        }

        // Redraw the graphs
        this.redrawGraphs();
    }

    // Set the current session on the server, so that it can assign the incoming data the correct session id
    createNewSession = async () => {
        this.props.data.currentSession = Number(await (await fetch("/api/newsession")).text());
        console.log(this.props.data.currentSession)
        this.props.data.newSessionModal = false
        this.props.data.viewState = ViewState.Recording
        this.props.data.recordBegin = Date.now() / 1000;
        this.setPanning(false)
        this.clearGraphs();
        this.redrawGraphs();
    }

    redrawGraphs = () => {
        this.tempGraph.current?.chartInstance.update()
        this.trykGraph.current?.chartInstance.update()
        this.højdeGraph.current?.chartInstance.update()
        this.accelGraph.current?.chartInstance.update()
    }

    clearGraphs = () => {
        this.tempGraph.current!.chartInstance.data.datasets[0].data = []
        this.tempGraph.current?.chartInstance.resetZoom();
        this.trykGraph.current!.chartInstance.data.datasets[0].data = []
        this.trykGraph.current?.chartInstance.resetZoom();
        this.højdeGraph.current!.chartInstance.data.datasets[0].data = []
        this.højdeGraph.current?.chartInstance.resetZoom();
        this.accelGraph.current!.chartInstance.data.datasets[0].data = []
        this.accelGraph.current!.chartInstance.data.datasets[1].data = []
        this.accelGraph.current!.chartInstance.data.datasets[2].data = []
        this.accelGraph.current?.chartInstance.resetZoom();
        this.props.data.data = [];
    }

    setPanning = (state: boolean) => {
        this.tempGraph.current!.chartInstance.options.plugins.zoom.pan.enabled = state
        this.tempGraph.current!.chartInstance.options.plugins.zoom.zoom.enabled = state
        this.trykGraph.current!.chartInstance.options.plugins.zoom.pan.enabled = state
        this.trykGraph.current!.chartInstance.options.plugins.zoom.zoom.enabled = state
        this.højdeGraph.current!.chartInstance.options.plugins.zoom.pan.enabled = state
        this.højdeGraph.current!.chartInstance.options.plugins.zoom.zoom.enabled = state
        this.accelGraph.current!.chartInstance.options.plugins.zoom.pan.enabled = state
        this.accelGraph.current!.chartInstance.options.plugins.zoom.zoom.enabled = state
    }

    viewOldSession = async (session: Session) => {
        // We start by dismissing the modal
        this.props.data.oldSessionModal = false
        this.props.data.viewState = ViewState.Viewing

        // Set new session
        this.props.data.currentSession = session.id;
        this.props.data.recordBegin = Math.floor(new Date(session.start).getTime()/1000);
        console.log(session.id)

        // Allow panning
        this.setPanning(true);

        // Clear data
        this.clearGraphs();

        (await fetch("/api/allfromsession?session="+session.id)).json().then((response) => {
            for(let elem of response) {
              // We need to parse the sensordata into the SensorData structure
              let sensordata: SensorData = this.props.data.ParseSensorData(elem);
              this.props.data.data.push(sensordata);

              this.tempGraph.current?.chartInstance.data.datasets[0].data.push ({x: sensordata.time, y: sensordata.temperature})
              this.trykGraph.current?.chartInstance.data.datasets[0].data.push ({x: sensordata.time, y: sensordata.pressure})
              this.højdeGraph.current?.chartInstance.data.datasets[0].data.push({x: sensordata.time, y: sensordata.height})
              this.accelGraph.current?.chartInstance.data.datasets[0].data.push({x: sensordata.time, y: sensordata.accelX})
              this.accelGraph.current?.chartInstance.data.datasets[1].data.push({x: sensordata.time, y: sensordata.accelY})
              this.accelGraph.current?.chartInstance.data.datasets[2].data.push({x: sensordata.time, y: sensordata.accelZ})
            }
          }).catch((error) => {
            throw "ERROR(fetching sensordata):" + error;
          });

        this.redrawGraphs();
    }

    render() {
        return (
            // prettier-ignore
            <>
                {/* Top Navigation Bar */}
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="#home">CanSat</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link onClick={()=>this.props.data.newSessionModal = true}>Ny session</Nav.Link>
                        <Nav.Link onClick={()=>this.props.data.oldSessionModal = true}>Gamle sessioner</Nav.Link>
                    </Nav>
                    <Navbar.Collapse className="justify-content-end">
                        <Navbar.Text>
                        Recording: <a>2313213</a>
                        </Navbar.Text>
                    </Navbar.Collapse>
                </Navbar>

                {/* The various modals */}
                <Modal
                    title="Bekræft ny session!"
                    show={this.props.data.newSessionModal}
                    onHide={()=>this.props.data.newSessionModal=false}
                    buttons={[
                        { name: 'Annuller', onClick: ()=>this.props.data.newSessionModal=false},
                        { name: 'Bekræft', onClick: this.createNewSession },
                    ]}>
                    Klik bekræft hvis du vil starte en ny session. (Det er ikke
                    muligt at genstarte en tidligere session)
                </Modal>

                <Modal
                    title="Vælg gammel session"
                    show={this.props.data.oldSessionModal}
                    onHide={() => this.props.data.oldSessionModal = false}
                    buttons={[{name: 'Fortsæt', onClick: () => this.props.data.oldSessionModal=false}]}>
                    <OldSessionList onSelectSession={this.viewOldSession}></OldSessionList>
                </Modal>

                {/* Main UI Content */}
                <div className="Container">
                    <div className="Col item1"></div>
                    <div className="Col item2"></div>
                    <div className="Col item3">
                        <GraphPanel>
                            <Graph
                                graphRef={this.tempGraph}
                                title="Temp."
                                graphTitle="Temperatur over tid"
                                xAxis="Tid (sek)"
                                yAxis="Temperatur (°C)"
                                graphs={['Temperatur']}
                            />
                            <Graph
                                graphRef={this.trykGraph}
                                title="Tryk"
                                graphTitle="Tryk over tid"
                                xAxis="Tid (sek)"
                                yAxis="Tryk (Pa)"
                                graphs={['Tryk']}
                            />
                            <Graph
                                graphRef={this.højdeGraph}
                                title="Højde"
                                graphTitle="Højde over tid"
                                xAxis="Tid (sek)"
                                yAxis="Højde (m)"
                                graphs={['Højde']}
                            />
                            <Graph
                                graphRef={this.accelGraph}
                                title="Accel."
                                graphTitle="Acceleration over tid"
                                xAxis="Tid (sek)"
                                yAxis="Acceleration (m/s²)"
                                graphs={['Accel X', 'Accel Y', 'Accel Z']}
                            />
                            <div title="Data">Tabel med alt data</div>
                        </GraphPanel>
                    </div>
                    <div className="Col item4"></div>
                    <div className="Col item5"></div>
                </div>
            </>
        )
    }
}

export default App
