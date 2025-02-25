import React, { useState, useRef } from 'react';
import { Modal, Button, Table ,Form} from 'react-bootstrap';
import { XLg, CloudUpload ,FilePlus} from 'react-bootstrap-icons';
import * as XLSX from 'xlsx';
import axios from 'axios';
import styled from 'styled-components';

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
export const StyledFormControl = styled(Form.Control)`
  width: 100%;
  height: 45px;
  padding: 10px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

export const StyledTextArea = styled(Form.Control)`
  width: 100%;
  height: 120px;
  padding: 10px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

export const StyledFileInput = styled(Form.Control)`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 8px;
  border: 1px solid #ccc;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
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

export const FermerButton = styled(Button)`
  background: linear-gradient(135deg,rgb(120, 1, 247), #2575fc);
  border: none;
  color: white;
  padding: 2px 15px;
  font-size: 15px;
  border-radius: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(106, 17, 203, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgb(235, 6, 6);
    background: linear-gradient(135deg, #2575fc, #6a11cb);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 15px rgb(235, 6, 6);
  }
`;

const ImporterProduitsModal = ({  show, handleClose}) => {
  const [data, setData] = useState([]);
  const [file, setFile] = useState(null);
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

  const handleCloseModal = () => {
    setFile(null); 
    setData([]); 
    handleClose(); };

  const Close = () => {
    handleClose()};


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

  const handleRowFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (!file || selectedRow === null) return;
    const previewUrl = URL.createObjectURL(file);
    switch (fileType) {
        case 'image':
            setProductImages(prev => ({
                ...prev,
                [selectedRow]: { file, preview: previewUrl }
            }));
            break;
        case 'dossierTechnique':
            setDossierTechnique(prev => ({
                ...prev,
                [selectedRow]: { file, preview: previewUrl }
            }));
            break;
        case 'dossierSerigraphie':
            setDossierSerigraphie(prev => ({
                ...prev,
                [selectedRow]: { file, preview: previewUrl }
            }));
            break;
        case 'bonDeCommande':
            setBonDeCommande(prev => ({
                ...prev,
                [selectedRow]: { file, preview: previewUrl }
            }));
            break;
        case 'patronage':
            setPatronage(prev => ({
                ...prev,
                [selectedRow]: { file, preview: previewUrl }
            }));
            break;
        default:
            break;
    }
};


  const setFileState = (state, rowIndex, file, previewUrl) => {
    state(prev => ({
      ...prev,
      [rowIndex]: { file, preview: previewUrl }
    }));
  }
  
  const handleFullImport = async () => {
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append('excel_file', file);

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
      await axios.post(
        'http://127.0.0.1:5000/importer/produits-images',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      handleCloseModal();
      window.location.reload();
    } catch (error) {
      console.error("Erreur lors de l'importation.", error);
    }
  };

  const handleDeleteFile = (rowIndex, fileType) => {
    if (fileType === 'image') {
      setProductImages((prev) => {
        const newImages = { ...prev };
        if (newImages[rowIndex]) {
          URL.revokeObjectURL(newImages[rowIndex].preview);
          delete newImages[rowIndex];
        }
        return newImages;
      });
    } else if (fileType === 'dossierTechnique') {
      setDossierTechnique((prev) => {
        const newDossier = { ...prev };
        if (newDossier[rowIndex]) {
          URL.revokeObjectURL(newDossier[rowIndex].preview);
          delete newDossier[rowIndex];
        }
        return newDossier;
      });
    } else if (fileType === 'dossierSerigraphie') {
      setDossierSerigraphie((prev) => {
        const newDossier = { ...prev };
        if (newDossier[rowIndex]) {
          URL.revokeObjectURL(newDossier[rowIndex].preview);
          delete newDossier[rowIndex];
        }
        return newDossier;
      });
    } else if (fileType === 'bonDeCommande') {
      setBonDeCommande((prev) => {
        const newDossier = { ...prev };
        if (newDossier[rowIndex]) {
          URL.revokeObjectURL(newDossier[rowIndex].preview);
          delete newDossier[rowIndex];
        }
        return newDossier;
      });
    } else if (fileType === 'patronage') {
      setPatronage((prev) => {
        const newDossier = { ...prev };
        if (newDossier[rowIndex]) {
          URL.revokeObjectURL(newDossier[rowIndex].preview);
          delete newDossier[rowIndex];
        }
        return newDossier;
      });
    }
  };

  return (
    <AnimatedModal show={show} onHide={Close} size="xl">
      <ModalHeader closeButton>
        <Modal.Title>
          📃*🧾 Importer un fichier Excel et les fichiers associés
        </Modal.Title>
      </ModalHeader>
      <ModalBody>
        <StyledFileInput
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
                        onContextMenu={(e) => { e.preventDefault(); handleDeleteFile(rowIndex, 'image'); }}/>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <FilePlus
                        style={{
                          cursor: 'pointer',
                          height: '50px',
                          color: 'gray',  
                        }}
                        onClick={() => handleRowFileButtonClick(rowIndex, 'image')} />
                      </div>
                    )}
                  </td>
                  <td>
                    {dossierTechnique[rowIndex] ? (
                      <a
                        href={dossierTechnique[rowIndex].preview}
                        target="_blank"
                        rel="noopener noreferrer"
                        onContextMenu={(e) => { e.preventDefault(); handleDeleteFile(rowIndex, 'dossierTechnique'); }} >
                        Dossier Technique
                      </a>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <FilePlus
                        style={{
                          cursor: 'pointer',
                          height: '50px',
                          color: 'gray',  
                        }}
                        onClick={() => handleRowFileButtonClick(rowIndex, 'dossierTechnique')}
                      />
                      </div>
                    )}
                  </td>
                  <td>
                    {dossierSerigraphie[rowIndex] ? (
                      <a
                        href={dossierSerigraphie[rowIndex].preview}
                        target="_blank"
                        rel="noopener noreferrer"
                        onContextMenu={(e) => { e.preventDefault(); handleDeleteFile(rowIndex, 'dossierSerigraphie');}} >
                        Dossier Sérigraphie
                      </a>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <FilePlus
                        style={{
                          cursor: 'pointer',
                          height: '50px',
                          color: 'gray',  
                        }}
                        onClick={() => handleRowFileButtonClick(rowIndex, 'dossierSerigraphie')}
                      />
                      </div>
                    )}
                  </td>
                  <td>
                    {bonDeCommande[rowIndex] ? (
                      <a
                        href={bonDeCommande[rowIndex].preview}
                        target="_blank"
                        rel="noopener noreferrer"
                        onContextMenu={(e) => {
                          e.preventDefault();
                          handleDeleteFile(rowIndex, 'bonDeCommande');
                        }}
                      >
                        Bon de Commande
                      </a>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <FilePlus
                        style={{
                          cursor: 'pointer',
                          height: '50px',
                          color: 'gray',  
                        }}
                        onClick={() => handleRowFileButtonClick(rowIndex, 'bonDeCommande')}
                      />
                      </div>
                    )}
                  </td>
                  <td>
                    {patronage[rowIndex] ? (
                      <a
                        href={patronage[rowIndex].preview}
                        target="_blank"
                        rel="noopener noreferrer"
                        onContextMenu={(e) => {
                          e.preventDefault();
                          handleDeleteFile(rowIndex, 'patronage');
                        }}
                      >
                        Patronage
                      </a>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <FilePlus
                        style={{
                          cursor: 'pointer',
                          height: '50px',
                          color: 'gray',  
                        }}
                        onClick={() => handleRowFileButtonClick(rowIndex, 'patronage')}
                      />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>Veuillez télécharger un fichier Excel.</p>
        )}
      </ModalBody>
      <Modal.Footer>
        <FermerButton variant="secondary" onClick={handleCloseModal}>
          <XLg /> Fermer
        </FermerButton>

        <GradientButton onClick={handleFullImport} disabled={!file || !data.length}>
          <CloudUpload />  Importer
        </GradientButton>
      </Modal.Footer>
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
    </AnimatedModal>
  );
  
};
export default ImporterProduitsModal;