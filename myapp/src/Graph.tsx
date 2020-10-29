import * as React from "react";
import { Component } from "react";
import { Nav } from "react-bootstrap";
import { Line } from "react-chartjs-2";

export interface GraphProps {
  title: string;
  graphTitle: string;
  yAxis: string;
  xAxis: string;
  graphRef: React.RefObject<Line>;
  graphs: string[];
}

export interface GraphState {
  data: any;
}

export class Graph extends React.Component<GraphProps, GraphState> {
  startUpdate: number = 0;
  constructor(props: GraphProps) {
    super(props);
    this.state = {
      data: {
        datasets: [],
      },
    };

    for(let graph of this.props.graphs) {
      this.state.data.datasets.push({
              label: graph,
              backgroundColor: "#ff0000",
              borderColor: "#ff0000",
              fill: false,
              data: [],
            })
    }

    this.startUpdate = Date.now();    
  }

  render() {
    return (
      <>
        <div style={{ display: "flex", flex: 1, backgroundColor: "white" }}>
          <Line
            ref={this.props.graphRef}
            data={this.state.data}
            options={{
              maintainAspectRatio: false,
              responsive: true,
              legend: {
                display: (this.props.graphs.length > 1)? true: false,
                position: 'right'
              },
              title: {
                display: true,
                text: this.props.graphTitle,
              },
              scales: {
                xAxes: [
                  {
                    type: "linear",
                    position: "bottom",
                    scaleLabel: {
                      display: true,
                      labelString: this.props.xAxis,
                    },
                    ticks: {
                      stepSize: 0.5,
                    },
                  },
                ],
                yAxes: [
                  {
                    scaleLabel: {
                      display: true,
                      labelString: this.props.yAxis,
                    },
                    ticks: {
                      suggestedMax: 35,
                      suggestedMin: 10,
                    },
                  },
                ],
              },
            }}
          />
        </div>
      </>
    );
  }
}
