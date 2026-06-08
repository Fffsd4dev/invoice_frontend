import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, CardBody, Col, Row } from 'react-bootstrap';
const StatCard = ({
  invoices_count,
  company_logo,
  company_name
}) => {
  return <Card>
      <CardBody>
        <Row>
          <Col xs={6}>
            <div className={`avatar-lg bg-opacity-10 rounded flex-centered`}>
              <img 
                  src={`${import.meta.env.VITE_BACKEND_URL}/image/logo/${company_logo}`}
                  alt="Company Logo" 
                  crossOrigin="anonymous"
                  className='form-control'
                />
            </div>
          </Col>
          <Col xs={6} className="text-end">
            <p className="text-muted mb-0 text-truncate">{company_name}</p>
            <h3 className="text-dark mt-1 mb-0">Invoices Generated: {invoices_count}</h3>
          </Col>
        </Row>
      </CardBody>
    </Card>;
};
const Stats = ({ analytics = [] }) => {
  console.log(`in stats ${analytics}`)

  if (!Array.isArray(analytics)) return null;
  return <Row>
      {analytics.map((stat, idx) => <Col md={6} xxl={12} key={idx}>
          <StatCard {...stat} />
        </Col>)}
    </Row>;
};
export default Stats;