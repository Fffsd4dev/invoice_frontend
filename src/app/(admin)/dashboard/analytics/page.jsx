import { Col, Row } from 'react-bootstrap';
import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import Stats from './components/Stats';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuthContext } from '@/context/useAuthContext';
export default function Home() {

  const [analytics, setAnalytics] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthContext();

    const fetchAnalytics = async () => {
      try {
            if (!user?.token) {
              throw new Error('Authentication required');
            }
    
      
            const response = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/api/analytics`,
              {
                headers: {
                  'Authorization': `Bearer ${user.token}`,
                  'Content-Type': 'application/json'
                }
              }
            );
      
            console.log('Fetched analytics:', response);
      
            const fetched = response.data.companies; 

            console.log(Array.isArray(fetched))
            console.log("fetched:", fetched)
            
      
            // API returns direct array of objects, not nested in data property
            if (Array.isArray(fetched)) {
              setAnalytics(fetched);
            } else {
              setAnalytics([]);
            }
            
            setLoading(false);
          } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to fetch Analytics');
            setLoading(false);
          }
    };

    useEffect(() => {
      fetchAnalytics();
    }, [user]);

  return <>
      <PageBreadcrumb title="Analytics" subName="Dashboards" />
      <PageMetaData title="Analytics" />

      <Row>
        <Col xxl={3}>
          <Stats 
            analytics={analytics} 
          />
        </Col>
      </Row>
    </>;
}