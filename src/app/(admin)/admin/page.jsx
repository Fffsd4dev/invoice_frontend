import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import AdminList from './components/AdminList';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';

const Admin = () => {
  const [adminData, setAdminData] = useState({
    admins: [],
    pagination: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const fetchAdmins = async (page = 1) => {
    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/system-admin/view-admins?page=${page}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data?.data) {
        setAdminData({
          admins: response.data.data.data || [],
          pagination: {
            current_page: response.data.data.current_page,
            last_page: response.data.data.last_page,
            per_page: response.data.data.per_page,
            total: response.data.data.total,
            from: response.data.data.from,
            to: response.data.data.to,
            links: response.data.data.links
          }
        });
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch admins');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [user]);

  const handlePageChange = (page) => {
    fetchAdmins(page);
  };

  const refreshAdmins = () => {
    fetchAdmins(adminData.pagination.current_page || 1);
  };

  if (loading) return <div className="text-center py-4">Loading admins...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <PageBreadcrumb subName="Account" title="Admin List" />
      <PageMetaData title="Admin" />
      {adminData.admins.length > 0 ? (
        <AdminList 
          admins={adminData.admins} 
          pagination={adminData.pagination}
          onPageChange={handlePageChange}
          refreshAdmins={refreshAdmins}
        />
      ) : (
        <div className="alert alert-info">No admins found</div>
      )}
    </>
  );
};

export default Admin;