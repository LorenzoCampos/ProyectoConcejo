import { Modal, Button } from 'react-bootstrap';

function DeleteModal({ show, onClose, onConfirm, itemType }) {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {itemType === "banner"
          ? "¿Estás seguro de que deseas eliminar este banner?"
          : "¿Estás seguro de que deseas eliminar esta noticia?"}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteModal;
