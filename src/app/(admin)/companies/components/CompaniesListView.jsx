import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card } from 'react-bootstrap';

const CompaniesListView = ({ companies, onEditClick, onDeleteClick }) => {
  return (
    <Card className="overflow-hidden mt-3">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>S/N</th>
              <th>Company Name</th>
              <th>Company Logo</th>
              <th>Company Address</th>
              <th>Company Phone</th>
              <th>Company Email</th>
              <th>Company Account Name</th>
              <th>Company Account Number</th>
              <th>Company Bank</th>
              <th>Company Colour</th>
              <th>Tax</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company, index) => (
              <tr key={company.id}>
                <td>
                  <span className="fw-semibold">{index + 1}</span>
                </td>
                <td>
                  <span className="fw-semibold">{company?.company_name}</span>
                </td>
                <td>
                  {/* <span className="fw-semibold">{company?.company_logo}</span> */}
                  <img 
                    className='img-fluid'
                    src={`${import.meta.env.VITE_BACKEND_URL}/image/logo/${company?.company_logo}`}
                    alt="Company Logo"
                  />
                </td>
                <td>
                  <span className="fw-semibold">{company?.company_address}</span>
                </td>
                <td>
                  <span className="fw-semibold">{company?.company_phone}</span>
                </td>
                <td>
                  <span className="fw-semibold">{company?.company_email}</span>
                </td>
                <td>
                  <span className="fw-semibold">{company?.company_account_name}</span>
                </td>
                <td>
                  <span className="fw-semibold">{company?.company_account_number}</span>
                </td>
                <td>
                  <span className="fw-semibold">{company?.company_bank}</span>
                </td>
                <td>
                  <span className="fw-semibold">{company.company_color}</span>
                </td>
                <td>
                  <span className="fw-semibold">{company?.tax}</span>
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-light me-2"
                    onClick={() => onEditClick(company)}
                  >
                    <IconifyIcon icon="bx:edit" />
                  </button>
                  <button 
                    className="btn btn-sm btn-light text-danger"
                    onClick={() => onDeleteClick(company)}
                  >
                    <IconifyIcon icon="bx:trash" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default CompaniesListView;