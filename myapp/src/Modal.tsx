import * as React from "react";
import { useState } from "react";
import { Button, Modal as BModal } from "react-bootstrap";

interface Props {
  children: any;
  title: string;
  show: boolean;
  onShow: (show: boolean) => void;
  buttons: { name: string; onClick: () => void }[];
}

export function Modal(props: Props) {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    props.onShow(false);
    setShow(false);
  };
  const handleShow = () => {
    props.onShow(true);
    setShow(true);
  };

  // This is called when the parent state is updated
  React.useEffect(() => {
    if (props.show) handleShow();
    else handleClose();
  }, [props.show]);

  return (
    <>
      <BModal show={show} onHide={handleClose}>
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
