import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import CompaniesList from './components/CompaniesList';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const fetchCompanies = async () => {
    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/company/list`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const fetched = response.data.data; 

      // API returns direct array of objects, not nested in data property
      if (Array.isArray(fetched)) {
        setCompanies(fetched);
      } else {
        setCompanies([]);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch communities');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [user]);

  const refreshCompanies = () => {
    fetchCompanies();
  };

  if (loading) return <div className="text-center py-4">Loading Companies...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <PageBreadcrumb subName="Companies" title="All Companies" />
      <PageMetaData title="Companies" />
      
      <CompaniesList 
        companies={companies}
        refreshCompanies={refreshCompanies}
      />
    </>
  );
};

export default Companies;