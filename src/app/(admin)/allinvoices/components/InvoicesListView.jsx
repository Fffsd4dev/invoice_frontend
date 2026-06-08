import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card } from 'react-bootstrap';

const InvoicesListView = ({ invoices, onDeleteClick }) => {
  return (
    <Card className="overflow-hidden mt-3">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>S/N</th>
              <th>Invoice Number</th>
              <th>Client Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, index) => (
              <tr key={invoice.id}>
                <td>
                  <span className="fw-semibold">{index + 1}</span>
                </td>
                <td>
                  <a href={`/invoice/${invoice?.id}`} className="fw-semibold">{invoice?.invoice_number}</a>
                </td>
                <td>
                  <span className="fw-semibold">{invoice?.client_name}</span>
                </td>
                
                <td>
                  <button 
                    className="btn btn-sm btn-light text-danger"
                    onClick={() => onDeleteClick(invoice)}
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

export default InvoicesListView;