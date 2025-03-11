import React from 'react';
import { Modal, ListGroup } from 'react-bootstrap';

const SearchResultsModal = ({ show, handleClose, results, error }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="bg-light">
        <Modal.Title>🔍 Résultats de recherche</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error ? (
          <div className="alert alert-danger">{error}</div>
        ) : results?.length > 0 ? (
          <ListGroup>
            {results.map((item) => (
              <ListGroup.Item
                key={item.id}
                action
                onClick={() => (window.location.href = `/produits/${item.id}`)}
                className="search-item"
              >
                <div className="d-flex justify-content-between">
                  <span>ID: <strong>{item.id}</strong></span>
                  <span>Style: <em>{item.style}</em></span>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <div className="text-muted">Aucun résultat trouvé</div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default SearchResultsModal;