import PageBreadcrumb from '@/components/layout/PageBreadcrumb';
import PageMetaData from '@/components/PageTitle';
import ApartmentAmenitiesList from './components/ApartmentAmenitiesList';
import { useParams } from "react-router-dom";
import '@/assets/scss/invoice.scss';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import { toWords } from "number-to-words";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


const PastInvoice = () => {
  const { invoiceId } = useParams();
  const { user } = useAuthContext();
  const [company, setCompany] = useState(null);
  const [invoice, setInvoice] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const invoiceRef = useRef(null);


  const fetchInvoice = async () => {
    try {
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      console.log({});

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/invoice/show/${invoiceId}`,
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Fetched invoices:', response);

      const fetched = response.data.invoice; 

      setInvoice(fetched);

      console.log(fetched.id);
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch Invoice');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [user]);

  // Calculate totals
  // const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  // let companyTax = 1;
  // if(company?.tax){
  //   companyTax = company?.tax;
  // }
  // const total = subtotal + (subtotal * (companyTax/100)); // (VAT or other charges can be added later)
  // const balanceDue = total; 

  // const loadcompany = async () => {
  //   try {
  //     const res = await axios.get(
  //       `${import.meta.env.VITE_BACKEND_URL}/api/company/show/${id}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${user.token}`,
  //         },
  //       }
  //     );

  //     setCompany(res.data.company);
  //     setInvoiceNumber(res.data.invoiceNumber);
  //     console.log(res.data);
  //     console.log(company);
  //     console.log(company.id);

  
  //   } catch (error) {
  //     console.error("Error loading company: ", error);
  //   }
  // };

  // const submitInvoice = async (e) => {
  //   e.preventDefault();

  //   const payload = {
  //     client_name: clientName,
  //     type: type,
  //     issue_date: issueDate,
  //     due_date: dueDate,
  //     company_id: company?.id,
  //     description: items.map((i) => i.description),
  //     note: items.map((i) => i.note),
  //     quantity: items.map((i) => Number(i.quantity)),
  //     rate: items.map((i) => Number(i.rate)),
  //   };

  //   try {
  //     const res = await axios.post(
  //       `${import.meta.env.VITE_BACKEND_URL}/api/invoice/create`,
  //       payload,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${user.token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     console.log("SUCCESS:", res.data);

  //     // After successful submission, trigger PDF download
  //     downloadPDF();

  //   } catch (error) {
  //     console.error("SUBMISSION ERROR:", error.response?.data || error);
  //   }
  // };



    //Download PDF
   const downloadPDF = async () => {
    const element = invoiceRef.current;

    //  Activate print mode (hide inputs, show text)
    element.classList.add("print-mode");

    // Wait a tiny bit so CSS applies
    await new Promise((r) => setTimeout(r, 200));

    // Convert to canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${invoice?.invoice_number}.pdf`);

    // Remove print mode after downloading
    element.classList.remove("print-mode");
  };



    // useEffect(() => {
    //   if (id && user?.token) {
    //     loadcompany();  
    //   }
    // }, [id, user]);

    // const totalAmount = items.reduce(
    //   (sum, item) => sum + item.quantity * item.rate,
    //   0
    // );

    // console.log(total);
    // const totalInWords = toWords(total);

  if (loading) return <div className="text-center py-4">Loading Invoices...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <div className="content-body">
        {/* <form onSubmit={submitInvoice}> */}
          <div className="invoice-container" ref={invoiceRef} id="invoice">
            <div className="invoice-header">
              <div className="invoice-log">
                <img 
                  src={`${import.meta.env.VITE_BACKEND_URL}/image/logo/${invoice?.company.company_logo}`}
                  alt="Company Logo" 
                  crossOrigin="anonymous"
                />

                <div className="company-name">{invoice?.company.company_name}</div>
                <div className="details">Address: {invoice?.company.company_address}</div>
                <div className="details">Phone: {invoice?.company.company_phone}</div>
                <div className="details">Email: {invoice?.company.company_email}</div>
              </div>

              <div className="invoice-company-details">
                <div className="invoice-name" style={{ color: invoice?.company.company_color }}>Invoice</div>
                <div className="invoice-no"># INV-{invoice?.invoice_number}</div>
                <div className="balance-due mt-3">Balance Due</div>
                <div className="balance-amount">NGN{invoice?.balance_due}</div>
              </div>
            </div>

          
            <div className="invoice-billing">
              <div className="client-name">
                <div>Bill To</div>
                <div>
                  <div className="">
                    {invoice?.client_name}
                  </div>
                </div>
              </div>

              <div className="invoice-date">
                <div className="invoice-date-div">
                  <div className="form-group d-flex align-items-center">
                    <div className="label-div">
                      <label htmlFor="invoice_date">Issue Date:</label>
                    </div>
                    <div className="input-div">
                      <div className="">
                        {invoice?.issue_date}
                      </div>
                    </div>
                  </div>

                  <div className="form-group d-flex align-items-center">
                    <div className="label-div">
                      <label htmlFor="invoice-setting">Custom:</label>
                    </div>
                    <div className="input-div">
                      <div className="">
                        {invoice?.type}
                      </div>
                    </div>
                  </div>

                  <div className="form-group d-flex align-items-center">
                    <div className="label-div">
                      <label htmlFor="due_date">Due Date:</label>
                    </div>
                    <div className="input-div">
                      <div className="">
                        {invoice?.due_date}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <table className="invoice-items mt-3">
              <thead style={{ backgroundColor: invoice?.company.company_color }}>
                <tr>
                  <th>#</th>
                  <th>Description</th>
                  <th style={{ width: "60px" }}>Qty</th>
                  <th style={{ width: "100px" }}>Rate</th>
                  <th style={{ width: "120px" }}>Amount</th>
                </tr>
              </thead>

              <tbody>
                {invoice?.items.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>

                    <td>
                      <div className="">
                        {item.description || ""}
                      </div>

                      <div className="">
                        {item.note || ""}
                      </div>
                    </td>

                    <td>
                      <div className="">
                        {item.quantity || ""}
                      </div>
                    </td>

                    <td>
                      <div className="">
                        {item.rate || ""}
                      </div>
                    </td>

                    <td>{(item.rate * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>

            </table>

            <table className="invoice-totals ">
              <tr>
                <td className="bold">SubTotal: NGN{invoice?.sub_total}</td>
              </tr>
              <tr>
                <td className="bold">Total: NGN{invoice?.total}<br/><span className="tax-span">(including {invoice?.tax}% tax)</span></td>
              </tr>
              <tr>
                <td className="bold">Balance Due: NGN{invoice?.balance_due}</td>
              </tr>
            </table>

            <div className="invoice-words mt-3 text-capitalize">
              <strong>Total (in words):</strong> {toWords(invoice?.balance_due)} Naira
            </div>

            <div className="invoice-footer">
              <div><strong>Account Name:</strong> {invoice?.company.company_account_name}</div>
              <div><strong>Account Number:</strong> {invoice?.company.company_account_number}</div>
              <div><strong>Bank:</strong> {invoice?.company.company_bank}</div>
            </div>
            
          
          </div>
          <button
              type="submit"
              style={{
                backgroundColor: invoice?.company.company_color,
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                marginTop: "20px"
              }}
              onClick={downloadPDF}
            >
              Download
            </button>
        {/* </form> */}
      </div>      
    </>
  );
};

export default PastInvoice;