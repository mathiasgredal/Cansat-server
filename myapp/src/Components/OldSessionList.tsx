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
import { inject, observer } from "mobx-react";
import DataStore from "../Stores/DataStore";
import { observable } from "mobx";

export interface Session {
  start: Date;
  id: number;
}

export interface Props {
    onSelectSession: (session: Session) => void;
    data?: DataStore;
}

@inject('data')
@observer 
class OldSessionList extends React.Component<Props> {
  @observable sessions: Session[] = [];

  constructor(props: Props) {
    super(props);

  }

  async componentWillMount() {
    this.sessions = await this.props.data!.FetchSessionList();
  }

  render() {
    return (
      <>
        <List className="sessionList">
          {this.sessions.map((value: Session) => {
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
                      this.sessions.filter(
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
