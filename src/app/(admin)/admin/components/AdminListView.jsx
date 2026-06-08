import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AdminListView = ({ admins, pagination, onPageChange, onEditClick, onDeleteClick, roles, loadingRoles }) => {
  const getRoleName = (roleId) => {
    if (loadingRoles) return 'Loading...';
    const role = roles.find(r => r.id == roleId);
    return role ? role.name : 'Super Admin';
  };

  const handlePageClick = (url, label) => {
    if (!url) return;
    const pageMatch = url.match(/page=(\d+)/);
    if (pageMatch) {
      onPageChange(pageMatch[1]);
    } else if (label === '&laquo; Previous' && pagination.current_page > 1) {
      onPageChange(pagination.current_page - 1);
    } else if (label === 'Next &raquo;' && pagination.current_page < pagination.last_page) {
      onPageChange(pagination.current_page + 1);
    }
  };

  const getPermissionBadges = (role) => {
    const permissions = [];
    if (role.manage_properties === 'yes') permissions.push('Properties');
    if (role.manage_accounts === 'yes') permissions.push('Accounts');
    if (role.manage_tenants === 'yes') permissions.push('Tenants');
    if (role.manage_admins === 'yes') permissions.push('Admins');
    
    return permissions.map((perm, index) => (
      <span key={index} className="badge bg-primary me-1">{perm}</span>
    ));
  };

  return (
    <Card className="overflow-hidden">
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>Admin</th>
              <th>Email</th>
              <th>Role</th>
              <th>Permissions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0 me-2">
                      <div className="avatar-xs">
                        <span className="avatar-title rounded-circle bg-light text-primary">
                          {admin.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <Link to={`/admin/${admin.id}`} className="text-body fw-semibold">
                        {admin.name}
                      </Link>
                    </div>
                  </div>
                </td>
                <td>{admin.email}</td>
                <td>
                  <span className="badge bg-success">
                    {getRoleName(admin.role_id)}
                  </span>
                </td>
                <td>
                  {admin.role ? getPermissionBadges(admin.role) : 'No permissions'}
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-light me-2"
                    onClick={() => onEditClick(admin)}
                  >
                    <IconifyIcon icon="bx:edit" />
                  </button>
                  <button 
                    className="btn btn-sm btn-light text-danger"
                    onClick={() => onDeleteClick(admin)}
                  >
                    <IconifyIcon icon="bx:trash" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination?.last_page > 1 && (
        <div className="d-flex justify-content-between align-items-center p-3 border-top">
          <div>
            Showing {pagination.from} to {pagination.to} of {pagination.total} entries
          </div>
          <ul className="pagination pagination-rounded mb-0">
            {pagination.links?.map((link, index) => (
              <li 
                key={index}
                className={`page-item ${link.active ? 'active' : ''} ${!link.url ? 'disabled' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageClick(link.url, link.label)}
                  disabled={!link.url}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};

export default AdminListView;