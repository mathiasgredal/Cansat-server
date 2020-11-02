import * as React from "react";
import { Component } from "react";
import { Nav } from "react-bootstrap";

export interface GraphPanelProps {}

export interface GraphPanelState {
  selected: string;
  views: { key: string; name: string; view: React.ReactNode }[];
}

export class GraphPanel extends React.Component<
  GraphPanelProps,
  GraphPanelState
> {
  constructor(props: any) {
    super(props);
    let theviews: GraphPanelState["views"] = [];
    React.Children.forEach(this.props.children, (child: React.ReactNode) => {
      // Simple typecasting
      let elem = child as React.DetailedReactHTMLElement<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      theviews.push({
        key: String(Math.floor(Math.random() * 1000000)), // Generate random id
        name: elem.props.title as string,
        view: elem,
      });
    });

    this.state = {
      selected: theviews[0].key,
      views: theviews,
    };
  }
  render() {
    return (
      <>
        {/* Add all nav tabs */}
        <Nav variant="pills" defaultActiveKey={this.state.views[0].key}>
          {this.state.views.map((view) => (
            <Nav.Item>
              <Nav.Link
                eventKey={view.key}
                onClick={() => this.setState({ selected: view.key })}
              >
                {view.name}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        {/* Show content of selected tab*/}
        <div
          style={{
            display: "flex",
            flex: 1,
            height: "100%",
            alignItems: "stretch",
          }}
        >
          {this.state.views.map((view) => (
            <div
              style={{
                display: view.key === this.state.selected ? "flex" : "none",
                width: "100%",
              }}
            >
              {view.view}
            </div>
          ))}
        </div>
      </>
    );
  }
}
