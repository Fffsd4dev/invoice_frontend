import { useState } from 'react';
import { Card, CardBody, Col, Row, Modal, Button, Alert, Spinner } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import ApartmentAmenitiesListView from './ApartmentAmenitiesListView';
import CreateApartmentAmenitiesModal from './CreateApartmentAmenitiesModal';
import { useAuthContext } from '@/context/useAuthContext';
import axios from 'axios';

const ApartmentAmenitiesList = ({ amenities, refreshAmenities }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuthContext();

  // Ensure amenities is always an array
  const amenitiesArray = Array.isArray(amenities) ? amenities : [];

  const handleAddClick = () => {
    setEditMode(false);
    setSelectedAmenity(null);
    setShowModal(true);
  };

  const handleEditClick = (amenity) => {
    setEditMode(true);
    setSelectedAmenity(amenity);
    setShowModal(true);
  };

  const handleDeleteClick = (amenity) => {
    setSelectedAmenity(amenity);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (!user?.token) {
        throw new Error('No authentication token found');
      }

      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/amenity/delete/${selectedAmenity.id}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
            "Accept": "application/json",
          }
        }
      );
      
      setSuccess('Apartment amenity deleted successfully!');
      refreshAmenities();
      
      setTimeout(() => {
        setShowDeleteModal(false);
        setSuccess(false);
      }, 1500);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete apartment amenity');
      console.error('Error deleting apartment amenity:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAmenities = amenitiesArray.filter(amenity => 
    amenity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (amenity.description && amenity.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                <div>
                  <form className="d-flex flex-wrap align-items-center gap-2">
                    <div className="search-bar me-3">
                      <span>
                        <IconifyIcon icon="bx:search-alt" className="mb-1" />
                      </span>
                      <input 
                        type="search" 
                        className="form-control" 
                        placeholder="Search amenities..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </form>
                </div>
                <div>
                  <button 
                    className="btn btn-primary"
                    onClick={handleAddClick}
                  >
                    <IconifyIcon icon="bi:plus" className="me-1" />
                    Add Amenity
                  </button>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {amenitiesArray.length > 0 ? (
        <ApartmentAmenitiesListView 
          amenities={filteredAmenities}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteClick}
        />
      ) : (
        <div className="alert alert-info">No apartment amenities found</div>
      )}

      <CreateApartmentAmenitiesModal 
        show={showModal}
        handleClose={() => setShowModal(false)}
        refreshAmenities={refreshAmenities}
        editMode={editMode}
        amenityToEdit={selectedAmenity}
      />

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success">
              {success}
            </Alert>
          )}
          
          {!success && (
            <>
              Are you sure you want to delete the <strong>{selectedAmenity?.name}</strong> amenity? This action cannot be undone.
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={loading}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteConfirm}
            disabled={loading || success}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                Deleting...
              </>
            ) : (
              <>
                <IconifyIcon icon="bx:trash" className="me-1" />
                Delete
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ApartmentAmenitiesList;