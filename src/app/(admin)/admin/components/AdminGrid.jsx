import { Card, Col, Row } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const AdminGrid = ({ admins }) => {
  return (
    <Row>
      {admins.map((admin) => (
        <Col key={admin.id} xl={3} lg={4} md={6}>
          <Card className="text-center">
            <Card.Body>
              <div className="mx-auto avatar-md mb-3">
                <span className="avatar-title rounded-circle bg-light text-primary fs-2">
                  {admin.name.charAt(0)}
                </span>
              </div>
              <h5 className="mb-1">{admin.name}</h5>
              <p className="text-muted">{admin.email}</p>
              
              <div className="mb-3">
                <span className="badge bg-success">{admin.role?.name || 'No role'}</span>
              </div>
              
              <div className="d-flex gap-2 justify-content-center mb-3">
                {admin.role?.manage_properties === 'yes' && (
                  <span className="badge bg-primary">Properties</span>
                )}
                {admin.role?.manage_admins === 'yes' && (
                  <span className="badge bg-danger">Admins</span>
                )}
              </div>
              
              <div className="d-flex gap-2 justify-content-center">
                <button className="btn btn-sm btn-light">
                  <IconifyIcon icon="bx:edit" />
                </button>
                <button className="btn btn-sm btn-light text-danger">
                  <IconifyIcon icon="bx:trash" />
                </button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default AdminGrid;