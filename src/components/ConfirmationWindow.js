
import { Modal, Button } from "react-bootstrap";

function ConfirmationWindow({show, children, onConfirm, onClose}){
    return(
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button onClick={onConfirm}>Confirm</Button>
        <Button onClick={onClose}>Cancel</Button>
      </Modal.Footer>
    </Modal> 
    )
  }

  export default ConfirmationWindow;