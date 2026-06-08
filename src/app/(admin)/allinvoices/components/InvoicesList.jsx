import { useState } from 'react';
import { Card, CardBody, Col, Row, Modal, Button, Alert, Spinner } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import InvoicesListView from './InvoicesListView';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '@/context/useAuthContext';
import axios from 'axios';

const InvoiceList = ({ invoices, refreshInvoices }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { user } = useAuthContext();
  const { id } = useParams();

  const handleDeleteClick = (invoice) => {
    setSelectedInvoice(invoice);
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
        `${import.meta.env.VITE_BACKEND_URL}/api/invoice/delete/${selectedInvoice.id}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
            "Accept": "application/json",
          }
        }
      );
      
      setSuccess('Invoice deleted successfully!');
      refreshInvoices();
      
      setTimeout(() => {
        setShowDeleteModal(false);
        setSuccess(false);
      }, 1500);
      
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete Invoice');
      console.error('Error deleting invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(invoice => 
    invoice.client_name.toLowerCase().includes(searchTerm.toLowerCase())
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
                        placeholder="Search client name..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </form>
                </div>
                <div>
                  <a 
                    className="btn btn-primary"
                    href={`/company/invoice/${id}`}
                  >
                    <IconifyIcon icon="bi:plus" className="me-1" />
                    New Invoice
                  </a>
                </div>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {invoices.length > 0 ? (
        <InvoicesListView 
          invoices={filteredInvoices}
          onDeleteClick={handleDeleteClick}
        />
      ) : (
        <div className="alert alert-info">No Invoice found</div>
      )}

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
              Are you sure you want to delete the <strong>{selectedInvoice?.invoice_number}</strong> invoice? This action cannot be undone.
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

export default InvoiceList;