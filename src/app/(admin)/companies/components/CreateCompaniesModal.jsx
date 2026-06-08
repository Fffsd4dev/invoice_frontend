import { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const CreateCompaniesModal = ({ 
  show, 
  handleClose, 
  refreshCompanies,
  editMode = false,
  companyToEdit = null
}) => {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState({
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (editMode && companyToEdit) {
      setFormData({
        company_name: companyToEdit.company_name || "",
        company_logo: null,
        company_phone: companyToEdit.company_phone || "",
        company_address: companyToEdit.company_address || "",
        company_color: companyToEdit.company_color || "",
        company_email: companyToEdit.company_email || "",
        company_account_name: companyToEdit.company_account_name || "",
        company_account_number: companyToEdit.company_account_number || "",
        company_bank: companyToEdit.company_bank || "",
        tax: companyToEdit.tax || ""
      });
    } else {
      setFormData({
        company_name: "",
        company_logo: null,
        company_phone: "",
        company_address: "",
        company_color: "",
        company_email: "",
        company_account_name: "",
        company_account_number: "",
        company_bank: "",
        tax: ""
      });
    }
    setError(null);
    setSuccess(false);
  }, [show, editMode, companyToEdit]);


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
    const form = new FormData();

    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        form.append(key, formData[key]);
      }
    });

    const url = editMode
      ? `${import.meta.env.VITE_BACKEND_URL}/api/company/update/${companyToEdit.id}`
      : `${import.meta.env.VITE_BACKEND_URL}/api/company/create`;

    await axios.post(url, form, {
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-Type": "multipart/form-data"
      }
    });

    setSuccess(true);
  } catch (err) {
    setError("Failed to save company");
  } finally {
    setLoading(false);
  }
};


  return (
    // <Modal show={show} onHide={handleClose} centered size="lg">
    //   <Modal.Header closeButton>
    //     <Modal.Title>
    //       {editMode ? 'Edit Company' : 'Create New Company'}
    //     </Modal.Title>
    //   </Modal.Header>
    //   <Form onSubmit={handleSubmit}>
    //     <Modal.Body>
    //       {error && (
    //         <Alert variant="danger" onClose={() => setError(null)} dismissible>
    //           {error}
    //         </Alert>
    //       )}
          
    //       {success && (
    //         <Alert variant="success">
    //           {editMode ? 'Company updated successfully!' : 'Company created successfully!'}
    //         </Alert>
    //       )}

    //       <Form.Group className="mb-3">
    //         <Form.Label>Company Name *</Form.Label>
    //         <Form.Control
    //           type="text"
    //           name="name"
    //           value={formData.name}
    //           onChange={handleChange}
    //           required
    //         />
    //       </Form.Group>

    //     </Modal.Body>
    //     <Modal.Footer>
    //       <Button variant="secondary" onClick={handleClose}>
    //         Cancel
    //       </Button>
    //       <Button variant="primary" type="submit" disabled={loading}>
    //         {loading ? (
    //           <>
    //             <IconifyIcon icon="eos-icons:loading" className="me-1" />
    //             {editMode ? 'Updating...' : 'Creating...'}
    //           </>
    //         ) : (
    //           <>
    //             <IconifyIcon icon={editMode ? "bx:save" : "bi:plus"} className="me-1" />
    //             {editMode ? 'Save Changes' : 'Create Amenity'}
    //           </>
    //         )}
    //       </Button>
    //     </Modal.Footer>
    //   </Form>
    // </Modal>
    <Modal show={show} onHide={handleClose} centered size="lg">
  <Modal.Header closeButton>
    <Modal.Title>
      {editMode ? 'Edit Company' : 'Create New Company'}
    </Modal.Title>
  </Modal.Header>

  <Form onSubmit={handleSubmit}>
    <Modal.Body>

      {/* ERROR MESSAGE */}
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      {/* SUCCESS MESSAGE */}
      {success && (
        <Alert variant="success">
          {editMode ? 'Company updated successfully!' : 'Company created successfully!'}
        </Alert>
      )}

      {/* COMPANY NAME */}
      <Form.Group className="mb-3">
        <Form.Label>Company Name *</Form.Label>
        <Form.Control
          type="text"
          name="company_name"
          value={formData.company_name}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* COMPANY LOGO */}
      <Form.Group className="mb-3">
        <Form.Label>Company Logo *</Form.Label>
        <Form.Control
          type="file"
          name="company_logo"
          accept="image/*"
          onChange={(e) =>
            setFormData({ ...formData, company_logo: e.target.files[0] })
          }
        />
        {editMode && formData.company_logo && (
          <div className="mt-2">
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}/storage/logo/${formData.company_logo}`}
              alt="Logo Preview"
              style={{ width: "120px", borderRadius: "6px" }}
            />
          </div>
        )}
      </Form.Group>

      {/* COMPANY PHONE */}
      <Form.Group className="mb-3">
        <Form.Label>Phone Number *</Form.Label>
        <Form.Control
          type="text"
          name="company_phone"
          value={formData.company_phone}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* COMPANY ADDRESS */}
      <Form.Group className="mb-3">
        <Form.Label>Address *</Form.Label>
        <Form.Control
          type="text"
          name="company_address"
          value={formData.company_address}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* COMPANY COLOR (HEX) */}
      <Form.Group className="mb-3">
        <Form.Label>Brand Color (Hex) *</Form.Label>
        <Form.Control
          type="text"
          name="company_color"
          value={formData.company_color}
          placeholder="#FF5733 or #FF5733AA"
          onChange={handleChange}
          required
        />
        <div
          style={{
            width: "60px",
            height: "25px",
            backgroundColor: formData.company_color,
            border: "1px solid #ccc",
            marginTop: "5px",
            borderRadius: "4px",
          }}
        ></div>
      </Form.Group>

      {/* COMPANY EMAIL */}
      <Form.Group className="mb-3">
        <Form.Label>Email *</Form.Label>
        <Form.Control
          type="email"
          name="company_email"
          value={formData.company_email}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* COMPANY ACCOUNT NAME */}
      <Form.Group className="mb-3">
        <Form.Label>Account Name *</Form.Label>
        <Form.Control
          type="text"
          name="company_account_name"
          value={formData.company_account_name}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* COMPANY ACCOUNT NUMBER */}
      <Form.Group className="mb-3">
        <Form.Label>Account Number *</Form.Label>
        <Form.Control
          type="number"
          name="company_account_number"
          value={formData.company_account_number}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* COMPANY BANK */}
      <Form.Group className="mb-3">
        <Form.Label>Bank *</Form.Label>
        <Form.Control
          type="text"
          name="company_bank"
          value={formData.company_bank}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* TAX (OPTIONAL) */}
      <Form.Group className="mb-3">
        <Form.Label>Tax (%)</Form.Label>
        <Form.Control
          type="number"
          step="0.01"
          name="tax"
          value={formData.tax}
          onChange={handleChange}
          placeholder="Optional"
        />
      </Form.Group>

    </Modal.Body>

    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Cancel
      </Button>

      <Button variant="primary" type="submit" disabled={loading}>
        {loading ? (
          <>
            <IconifyIcon icon="eos-icons:loading" className="me-1" />
            {editMode ? 'Updating...' : 'Creating...'}
          </>
        ) : (
          <>
            <IconifyIcon icon={editMode ? "bx:save" : "bi:plus"} className="me-1" />
            {editMode ? 'Save Changes' : 'Create Company'}
          </>
        )}
      </Button>
    </Modal.Footer>
  </Form>
</Modal>

  );
};

export default CreateCompaniesModal;