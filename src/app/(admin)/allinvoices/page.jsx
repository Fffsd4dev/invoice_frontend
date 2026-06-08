import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import InvoicesList from './components/InvoicesList';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [company, setCompany] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const { id } = useParams();

  const fetchInvoices = async () => {
    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      console.log({});

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/invoice/list/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Fetched invoices:', response);

      const fetched = response.data; 

      // API returns direct array of objects, not nested in data property
      if (Array.isArray(fetched.invoices)) {
        setInvoices(fetched.invoices);
        setCompany(fetched.company.company_name);
      } else {
        setInvoices([]);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch Invoices');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [user]);

  const refreshInvoices = () => {
    fetchInvoices();
  };

  if (loading) return <div className="text-center py-4">Loading Invoices...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <PageBreadcrumb subName={company} title={`${company} Invoices`}/>
      <PageMetaData title={company} />
      
      <InvoicesList 
        invoices={invoices}
        refreshInvoices={refreshInvoices}
      />
    </>
  );
};

export default Invoices;