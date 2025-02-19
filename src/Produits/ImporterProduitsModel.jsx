import React, { useState, useRef } from 'react';
import { Modal, Button, Table, Alert } from 'react-bootstrap';
import { FilePlus } from 'react-bootstrap-icons';
import * as XLSX from 'xlsx';
import axios from 'axios';

const ImporterProduitsModal = ({ show, handleClose }) => {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [productImages, setProductImages] = useState({});
  const [dossierTechnique, setDossierTechnique] = useState({});
  const [dossierSerigraphie, setDossierSerigraphie] = useState({});
  const [bonDeCommande, setBonDeCommande] = useState({});
  const [patronage, setPatronage] = useState({});
  const fileInputRef = useRef(null);
  const dossierTechniqueInputRef = useRef(null);
  const dossierSerigraphieInputRef = useRef(null);
  const bonDeCommandeInputRef = useRef(null);
  const patronageInputRef = useRef(null);
  const [selectedRow, setSelectedRow] = useState(null);

  // Lecture du fichier Excel
  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
      setData(jsonData);
    };
    reader.readAsBinaryString(selectedFile);
  };

  // Sélection d'un fichier pour une ligne donnée
  const handleRowFileButtonClick = (rowIndex, fileType) => {
    setSelectedRow(rowIndex);
    if (fileType === 'image') {
      fileInputRef.current.click();
    } else if (fileType === 'dossierTechnique') {
      dossierTechniqueInputRef.current.click();
    } else if (fileType === 'dossierSerigraphie') {
      dossierSerigraphieInputRef.current.click();
    } else if (fileType === 'bonDeCommande') {
      bonDeCommandeInputRef.current.click();
    } else if (fileType === 'patronage') {
      patronageInputRef.current.click();
    }
  };

  // Gestion de la sélection de fichier
  const handleRowFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (!file || selectedRow === null) return;
    const previewUrl = URL.createObjectURL(file);
    
    if (fileType === 'image') {
      setProductImages((prev) => ({
        ...prev,
        [selectedRow]: { file, preview: previewUrl }
      }));
    } else if (fileType === 'dossierTechnique') {
      setDossierTechnique((prev) => ({
        ...prev,
        [selectedRow]: { file, preview: previewUrl }
      }));
    } else if (fileType === 'dossierSerigraphie') {
      setDossierSerigraphie((prev) => ({
        ...prev,
        [selectedRow]: { file, preview: previewUrl }
      }));
    } else if (fileType === 'bonDeCommande') {
      setBonDeCommande((prev) => ({
        ...prev,
        [selectedRow]: { file, preview: previewUrl }
      }));
    } else if (fileType === 'patronage') {
      setPatronage((prev) => ({
        ...prev,
        [selectedRow]: { file, preview: previewUrl }
      }));
    }
  };

  // Envoi combiné du fichier Excel et des fichiers associés
  const handleFullImport = async () => {
    if (!file) {
      setUploadError("Veuillez sélectionner un fichier Excel.");
      return;
    }
    const formData = new FormData();
    formData.append('excel_file', file);

    // Ajouter les fichiers associés au FormData
    Object.keys(productImages).forEach((rowIndex) => {
      const imageData = productImages[rowIndex];
      formData.append(`image_${parseInt(rowIndex) + 1}`, imageData.file);
    });

    Object.keys(dossierTechnique).forEach((rowIndex) => {
      const dossierData = dossierTechnique[rowIndex];
      formData.append(`dossier_technique_${parseInt(rowIndex) + 1}`, dossierData.file);
    });

    Object.keys(dossierSerigraphie).forEach((rowIndex) => {
      const dossierData = dossierSerigraphie[rowIndex];
      formData.append(`dossier_serigraphie_${parseInt(rowIndex) + 1}`, dossierData.file);
    });

    Object.keys(bonDeCommande).forEach((rowIndex) => {
      const dossierData = bonDeCommande[rowIndex];
      formData.append(`bon_de_commande_${parseInt(rowIndex) + 1}`, dossierData.file);
    });

    Object.keys(patronage).forEach((rowIndex) => {
      const dossierData = patronage[rowIndex];
      formData.append(`patronage_${parseInt(rowIndex) + 1}`, dossierData.file);
    });

    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/importer/produits-images',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setUploadMessage(response.data.message);
      setUploadError(null);
    } catch (error) {
      setUploadError(
        error.response?.data?.message || "Erreur lors de l'importation."
      );
      setUploadMessage(null);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>
          Importer un fichier Excel et les fichiers associés
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          type="file"
          accept=".xls,.xlsx"
          onChange={handleFile}
          className="form-control mb-3"
        />
        {data.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                {data[0].map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
                <th>Image</th>
                <th>Dossier Technique</th>
                <th>Dossier Sérigraphie</th>
                <th>Bon de Commande</th>
                <th>Patronage</th>
              </tr>
            </thead>
            <tbody>
              {data.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                  <td>
                    {productImages[rowIndex] ? (
                      <img
                        src={productImages[rowIndex].preview}
                        alt="Produit"
                        style={{
                          width: '50px',
                          height: '50px',
                          objectFit: 'cover',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleRowFileButtonClick(rowIndex, 'image')}
                      />
                    ) : (
                      <FilePlus
                        size={50}
                        color="gray"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleRowFileButtonClick(rowIndex, 'image')}
                      />
                    )}
                  </td>
                  <td>
                    {dossierTechnique[rowIndex] ? (
                      <a
                        href={dossierTechnique[rowIndex].preview}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Dossier Technique
                      </a>
                    ) : (
                      <FilePlus
                        size={50}
                        color="gray"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleRowFileButtonClick(rowIndex, 'dossierTechnique')}
                      />
                    )}
                  </td>
                  <td>
                    {dossierSerigraphie[rowIndex] ? (
                      <a
                        href={dossierSerigraphie[rowIndex].preview}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Dossier Sérigraphie
                      </a>
                    ) : (
                      <FilePlus
                        size={50}
                        color="gray"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleRowFileButtonClick(rowIndex, 'dossierSerigraphie')}
                      />
                    )}
                  </td>
                  <td>
                    {bonDeCommande[rowIndex] ? (
                      <a
                        href={bonDeCommande[rowIndex].preview}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Bon de Commande
                      </a>
                    ) : (
                      <FilePlus
                        size={50}
                        color="gray"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleRowFileButtonClick(rowIndex, 'bonDeCommande')}
                      />
                    )}
                  </td>
                  <td>
                    {patronage[rowIndex] ? (
                      <a
                        href={patronage[rowIndex].preview}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Patronage
                      </a>
                    ) : (
                      <FilePlus
                        size={50}
                        color="gray"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleRowFileButtonClick(rowIndex, 'patronage')}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>Veuillez télécharger un fichier Excel.</p>
        )}
        {uploadMessage && (
          <Alert variant="success" className="mt-3">
            {uploadMessage}
          </Alert>
        )}
        {uploadError && (
          <Alert variant="danger" className="mt-3">
            {uploadError}
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Fermer
        </Button>
        <Button
          variant="primary"
          onClick={handleFullImport}
          disabled={!file || !data.length}
        >
          Importer
        </Button>
      </Modal.Footer>

      {/* Fichiers */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="d-none"
        onChange={(e) => handleRowFileChange(e, 'image')}
      />
      <input
        ref={dossierTechniqueInputRef}
        type="file"
        accept=".pdf"
        className="d-none"
        onChange={(e) => handleRowFileChange(e, 'dossierTechnique')}
      />
      <input
        ref={dossierSerigraphieInputRef}
        type="file"
        accept=".pdf"
        className="d-none"
        onChange={(e) => handleRowFileChange(e, 'dossierSerigraphie')}
      />
      <input
        ref={bonDeCommandeInputRef}
        type="file"
        accept=".pdf"
        className="d-none"
        onChange={(e) => handleRowFileChange(e, 'bonDeCommande')}
      />
      <input
        ref={patronageInputRef}
        type="file"
        accept=".pdf"
        className="d-none"
        onChange={(e) => handleRowFileChange(e, 'patronage')}
      />
    </Modal>
  );
};

export default ImporterProduitsModal;
