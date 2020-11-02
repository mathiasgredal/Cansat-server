import * as React from "react";
import {
  Checkbox,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import GetAppIcon from "@material-ui/icons/GetApp";
import dateFormat from "dateformat";

export interface Session {
  start: Date;
  id: number;
}

export interface Props {
    onSelectSession: (session: Session) => void;
}

export interface State {
  sessions: Session[];
}

class OldSessionList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      sessions: [
        { start: new Date(), id: 1 },
        { start: new Date(), id: 2 },
        { start: new Date(), id: 3 },
        { start: new Date(), id: 4 },
        { start: new Date(), id: 5 },
        { start: new Date(), id: 6 },
        { start: new Date(), id: 7 },
        { start: new Date(), id: 8 },
        { start: new Date(), id: 9 },
      ],
    };
  }

  // Fetch the session list
  async componentDidMount() {
    try {
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    return (
      <>
        <List className="sessionList">
          {this.state.sessions.map((value: Session) => {
            const labelId = `checkbox-list-label-${value.id}`;

            return (
              <>
                <ListItem
                  key={value.id}
                  role={undefined}
                  dense
                  button
                  onClick={() => 
                    this.props.onSelectSession(
                      this.state.sessions.filter(
                        (elem) => elem.id == value.id
                      )[0]
                    )
                  }
                >
                  <ListItemText
                    id={labelId}
                    primary={`Session ${value.id}: ${dateFormat(
                      value.start,
                      "yyyy/mm/dd - HH:MM:ss"
                    )}`}
                  />
                  <ListItemSecondaryAction style={{height: 25}}>
                    <GetAppIcon />
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </>
            );
          })}
        </List>
      </>
    );
  }
}

export default OldSessionList;
