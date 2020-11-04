import { inject, observer } from "mobx-react";
import * as React from "react";
import { useState } from "react";
import { Button, Modal as BModal } from "react-bootstrap";
import DataStore from "../Stores/DataStore";

interface Props {
  children: any;
  title: string;
  show: boolean;
  buttons: { name: string; onClick: () => void }[];
  onHide: () => void;
}

const Modal = (props: Props) => {
    return (
      <>
        <BModal show={props.show} onHide={props.onHide}>
          <BModal.Header closeButton>
            <BModal.Title>{props.title}</BModal.Title>
          </BModal.Header>
          <BModal.Body>{props.children}</BModal.Body>
          <BModal.Footer>
            {props.buttons.map((button) => {
              return (
                <button className="button" onClick={button.onClick}>
                  {button.name}
                </button>
              );
            })}
          </BModal.Footer>
        </BModal>
      </>
    );
}

export default observer(Modal)
