import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const CreateAdminModal = ({ 
  show, 
  handleClose, 
  refreshAdmins,
  editMode = false,
  adminToEdit = null,
  roles = [],
  loadingRoles
}) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role_id: roles[0]?.id || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (editMode && adminToEdit) {
      setFormData({
        name: adminToEdit.name,
        email: adminToEdit.email,
        role_id: adminToEdit.role_id?.toString() || roles[0]?.id || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role_id: roles[0]?.id || ''
      });
    }
    setError(null);
    setSuccess(false);
  }, [show, editMode, adminToEdit, roles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let response;
      if (editMode && adminToEdit) {
        response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/update-admin/${adminToEdit.uuid}`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/create-admin`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        role_id: roles[0]?.id || ''
      });
      refreshAdmins();
      setTimeout(() => {
        handleClose();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{editMode ? 'Edit Admin' : 'Add New Admin'}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success">
              {editMode ? 'Admin updated successfully!' : 'Admin created successfully!'}
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            {loadingRoles ? (
              <div className="d-flex align-items-center">
                <Spinner animation="border" size="sm" className="me-2" />
                <span>Loading roles...</span>
              </div>
            ) : (
              <Form.Select
                name="role_id"
                value={formData.role_id}
                onChange={handleChange}
                required
                disabled={roles.length === 0}
              >
                {roles.length === 0 ? (
                  <option>No roles available</option>
                ) : (
                  roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))
                )}
              </Form.Select>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading || loadingRoles || roles.length === 0}
          >
            {loading ? (
              <>
                <IconifyIcon icon="eos-icons:loading" className="me-1" />
                {editMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <IconifyIcon icon={editMode ? "bx:save" : "bi:plus"} className="me-1" />
                {editMode ? 'Save Changes' : 'Create Admin'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateAdminModal;