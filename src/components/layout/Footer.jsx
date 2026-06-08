import { currentYear, developedBy, developedByLink } from '@/context/constants';
import { Col, Container, Row } from 'react-bootstrap';
const Footer = () => {
  return <footer className="footer">
      <Container fluid>
        <Row>
          <Col xs={12} className="text-center">
            <span className="icons-center">
              {' '}
              {currentYear} © MaypasInvoice. All Rights Reserved.
            </span>
          </Col>
        </Row>
      </Container>
    </footer>;
};
export default Footer;