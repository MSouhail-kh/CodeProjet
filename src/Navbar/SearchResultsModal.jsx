import React, { useState } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import { XLg, Search } from 'react-bootstrap-icons';
import styled from 'styled-components';
import api from '../services/axios';

export const AnimatedModal = styled(Modal)`
  animation: fadeInUp 0.5s ease-out;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);

  .modal-content {
    border: none;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const ModalBody = styled(Modal.Body)`
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
`;

export const ModalHeader = styled(Modal.Header)`
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  border-bottom: none;
  
  .modal-title {
    color: white;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
  
  .btn-close {
    filter: invert(1);
  }
`;

export const GradientButton = styled(Button)`
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  border: none;
  color: white;
  padding: 2px 15px;
  font-size: 15px;
  border-radius: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(106, 17, 203, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(121, 3, 248, 0.56);
    background: linear-gradient(135deg, #6a11cb);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 15px rgba(106, 17, 203, 0.3);
  }
`;

const SearchResultsModal = ({ show, handleClose }) => {
  const [searchValue, setSearchValue] = useState('');
  const [searchType, setSearchType] = useState('style');
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(null);

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await api.post('/produits/search', { 
        searchType,
        searchValue,
      }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
        withXSRFToken: true
      });  
      setSearchResults(response.data.results);
      setSearchError(null);
    } catch (err) {
      setSearchError(err.response?.data?.error || 'An error occurred');
      setSearchResults([]);
    }
  };

  return (
    <AnimatedModal show={show} onHide={handleClose} size="lg">
      <ModalHeader closeButton>
        <Modal.Title>🔍 Search Products</Modal.Title>
      </ModalHeader>
      <ModalBody>
        <Form>
          <Form.Group controlId="formSearchValue">
            <Form.Label>Search</Form.Label>
            <Form.Control
              type="text"
              value={searchValue}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formSearchType">
            <Form.Label>Search By</Form.Label>
            <Form.Control as="select" value={searchType} onChange={handleSearchTypeChange}>
              <option value="style">Style</option>
              <option value="po">PO</option>
              <option value="brand">Brand</option>
              <option value="coloris">Coloris</option>
              <option value="reference">Reference</option>
            </Form.Control>
          </Form.Group>

        </Form>
        {searchError && <p className="text-danger mt-3">{searchError}</p>}
        {searchResults.length > 0 && (
          <Table striped bordered hover responsive className="mt-3">
            <thead>
              <tr>
                <th>ID</th>
                <th>Style</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((result) => (
                <tr key={result.id}>
                  <td>{result.id}</td>
                  <td>{result.style}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </ModalBody>
      <Modal.Footer>
          <GradientButton onClick={handleSearch}>
              <Search /> Search
          </GradientButton>
      </Modal.Footer>
    </AnimatedModal>
  );
};

export default SearchResultsModal;
