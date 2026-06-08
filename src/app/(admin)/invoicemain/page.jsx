import { useParams } from "react-router-dom";
import '@/assets/scss/invoice.scss';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useAuthContext } from '@/context/useAuthContext';
import { toWords } from "number-to-words";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";


const InvoiceMain = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [invoiceNumber, setInvoiceNumber] = useState(null);
  const [clientName, setClientName] = useState("");
  const [type, setType] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [inputErrors, setInputErrors] = useState({});
  const [showDelete, setShowDelete] = useState(true);
  const [items, setItems] = useState([
    { description: "", note: "", quantity: 1, rate: 0, amount: 0 }
  ]);
  const invoiceRef = useRef(null);

  // Add row
  const addLine = () => {
    setItems([
      ...items,
      { description: "", note: "", quantity: 1, rate: 0, amount: 0 }
    ]);
  };

  // Delete row
  const deleteLine = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Handle input changes (qty, rate, description, note)
  const handleChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    // Recalculate amount when qty or rate changes
    if (field === "quantity" || field === "rate") {
      const qty = Number(updated[index].quantity);
      const rate = Number(updated[index].rate);
      updated[index].amount = qty * rate;
    }

    setItems(updated);
  };

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  let companyTax = 1;
  if(company?.tax){
    companyTax = company?.tax;
  }
  const total = subtotal + (subtotal * (companyTax/100)); // (VAT or other charges can be added later)
  const balanceDue = total; 

  const loadcompany = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/company/show/${id}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        setCompany(res.data.company);
        setInvoiceNumber(res.data.invoiceNumber);
        console.log(res.data);
        console.log(company);
        // console.log(company.id);
  
        setLoading(false);
        console.log(loading);
      } catch (error) {
        console.error("Error loading company: ", error);
      }
    };

  const submitInvoice = async (e) => {
    e.preventDefault();

    const newInputErrors = {};

    // Validate simple required fields
    if (!clientName) newInputErrors.clientName = true;
    if (!type) newInputErrors.type = true;
    if (!issueDate) newInputErrors.issueDate = true;
    if (!dueDate) newInputErrors.dueDate = true;

    // Validate items (description, quantity, rate)
    items.forEach((item, index) => {
      if (!item.description) newInputErrors[`desc_${index}`] = true;
      if (!item.quantity) newInputErrors[`qty_${index}`] = true;
      if (!item.rate) newInputErrors[`rate_${index}`] = true;
    });

    // If there are any errors, stop submission
    if (Object.keys(newInputErrors).length > 0) {
      setInputErrors(newInputErrors);
      console.log("Input error: "+ inputErrors);
      window.scrollTo(0, 0);
      return; 
    }

  // Clear errors if all fields valid
  setInputErrors({});

    const payload = {
      client_name: clientName,
      type: type,
      issue_date: issueDate,
      due_date: dueDate,
      sub_total: subtotal,
      total: total,
      balance_due: balanceDue,
      tax: company?.tax,
      company_id: company?.id,
      description: items.map((i) => i.description),
      note: items.map((i) => i.note),
      quantity: items.map((i) => Number(i.quantity)),
      rate: items.map((i) => Number(i.rate)),
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/invoice/create`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("SUCCESS:", res.data);

      // After successful submission, trigger PDF download
      await downloadPDF();

      // Reset all form fields
      setClientName("");
      setType("");
      setIssueDate("");
      setDueDate("");
      setItems([{ description: "", quantity: "", rate: "", note: "" }]);

    } catch (error) {
      console.error("SUBMISSION ERROR:", error.response?.data || error);
    }
  };

    //Download PDF
   const downloadPDF = async () => {
    const element = invoiceRef.current;

    //  Activate print mode (hide inputs, show text)
    element.classList.add("print-mode");

    setShowDelete(false);

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
    pdf.save(`${invoiceNumber}.pdf`);

    // Remove print mode after downloading
    element.classList.remove("print-mode");
    setShowDelete(true);
  };



    useEffect(() => {
      if (id && user?.token) {
        loadcompany();  
      }
    }, [id, user]);

    const totalAmount = items.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0
    );

    console.log(total);
    const totalInWords = toWords(total? total : 0);

  if (loading) return <div className="text-center py-4">Loading Invoices...</div>;
  // if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <>
      <div className="content-body">
        <form onSubmit={submitInvoice}>
          <div className="invoice-container" ref={invoiceRef} id="invoice">
            <div className="invoice-header">
              <div className="invoice-log">
                <img 
                  src={`${import.meta.env.VITE_BACKEND_URL}/image/logo/${company?.company_logo}`}
                  alt="Company Logo" 
                  crossOrigin="anonymous"
                />

                <div className="company-name">{company?.company_name}</div>
                <div className="details">Address: {company?.company_address}</div>
                <div className="details">Phone: {company?.company_phone}</div>
                <div className="details">Email: {company?.company_email}</div>
              </div>

              <div className="invoice-company-details">
                <div className="invoice-name" style={{ color: company?.company_color }}>Invoice</div>
                <div className="invoice-no"># INV-{invoiceNumber}</div>
                <div className="balance-due mt-3">Balance Due</div>
                <div className="balance-amount">NGN{balanceDue.toFixed(2)}</div>
              </div>
            </div>

          
            <div className="invoice-billing">
              <div className="client-name">
                <div>Bill To</div>
                <div>
                  <input 
                    type="text" 
                    name="client_name" 
                    className={`form-control mb-2 ${inputErrors.clientName ? "invoice_error" : ""}`}
                    placeholder="Client Name" 
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                  <div className="input-as-text">
                    {clientName || ""}
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
                      <input 
                        type="date" 
                        id="issue_date" 
                        name="issue_date" 
                        className={`form-control ${inputErrors.issueDate ? "invoice_error" : ""}`}
                        value={issueDate}
                        onChange={(e) => setIssueDate(e.target.value)}
                      />
                      <div className="input-as-text">
                        {issueDate || ""}
                      </div>
                    </div>
                  </div>

                  <div className="form-group d-flex align-items-center">
                    <div className="label-div">
                      <label htmlFor="invoice-setting">Custom:</label>
                    </div>
                    <div className="input-div">
                      <select 
                        id="invoice-setting" 
                        name="invoice-setting" 
                        className={`form-control ${inputErrors.type ? "invoice_error" : ""}`}
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                      >
                        <option value="">Select one</option>
                        <option value="due on receipt">Due on receipt</option>
                        <option value="custom">Custom</option>
                      </select>
                      <div className="input-as-text">
                        {type || ""}
                      </div>
                    </div>
                  </div>

                  <div className="form-group d-flex align-items-center">
                    <div className="label-div">
                      <label htmlFor="due_date">Due Date:</label>
                    </div>
                    <div className="input-div">
                      <input 
                        type="date" 
                        id="due_date" 
                        name="due_date" 
                        className={`form-control ${inputErrors.dueDate ? "invoice_error" : ""}`}
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                      <div className="input-as-text">
                        {dueDate || ""}
                      </div>
                      <input type="hidden" name="company_id" value={company?.id}/>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <table className="invoice-items mt-3">
              <thead style={{ backgroundColor: company?.company_color }}>
                <tr>
                  <th>#</th>
                  <th>Description</th>
                  <th style={{ width: "100px" }}>Qty</th>
                  <th style={{ width: "100px" }}>Rate</th>
                  <th style={{ width: "120px" }}>Amount</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>

                    <td>
                      <input 
                        type="text"
                        className={`form-control mb-2 ${inputErrors[`desc_${index}`] ? "invoice_error" : ""}`}
                        placeholder="Item Description"
                        value={item.description}
                        onChange={(e) => handleChange(index, "description", e.target.value)}
                      />
                      <div className="input-as-text">
                        {item.description || ""}
                      </div>

                      <input 
                        type="text"
                        className="form-control"
                        placeholder="Item Notes"
                        value={item.note}
                        onChange={(e) => handleChange(index, "note", e.target.value)}
                      />
                      <div className="input-as-text">
                        {item.note || ""}
                      </div>
                    </td>

                    <td>
                      <input 
                        type="number"
                        className={`form-control ${inputErrors[`qty_${index}`] ? "invoice_error" : ""}`}
                        value={item.quantity}
                        onChange={(e) => handleChange(index, "quantity", e.target.value)}
                      />
                      <div className="input-as-text">
                        {item.quantity || ""}
                      </div>
                    </td>

                    <td>
                      <input 
                        type="number"
                        className={`form-control ${inputErrors[`rate_${index}`] ? "invoice_error" : ""}`}
                        value={item.rate}
                        onChange={(e) => handleChange(index, "rate", e.target.value)}
                      />
                      <div className="input-as-text">
                        {item.rate || ""}
                      </div>
                    </td>

                    <td>{item.amount?.toFixed(2)}</td>

                    <td className={showDelete ? "" : "d-none"} id="deleteLine">
                      <button
                        type="button"
                        onClick={() => deleteLine(index)}
                        style={{
                          color: "white",
                          backgroundColor: company?.company_color,
                          border: "none",
                          padding: "5px 10px",
                          borderRadius: "4px"
                        }}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

            <div>
              <button 
                type="button"
                onClick={addLine}
                style={{ border: `1px solid ${company?.company_color}`, color: company?.company_color }}
              >
                Add Line
              </button>

            </div>

            <table className="invoice-totals">
              <tr>
                <td className="bold">SubTotal: NGN{subtotal.toFixed(2)}</td>
                <input type="hidden" value={subtotal.toFixed(2)} name="sub_total"/>
              </tr>
              <tr>
                <td className="bold">Total: NGN{total.toFixed(2)}<br/><span className="tax-span">(including {company?.tax}% tax)</span></td>
                <input type="hidden" value={total.toFixed(2)} name="total"/>
                <input type="hidden" value={company?.tax} name="tax"/>
              </tr>
              <tr>
                <td className="bold">Balance Due: NGN{balanceDue.toFixed(2)}</td>
                <input type="hidden" value={balanceDue.toFixed(2)} name="balance_due"/>
              </tr>
            </table>

            <div className="invoice-words mt-3 text-capitalize">
              <strong>Total (in words):</strong> {totalInWords} Naira
            </div>

            <div className="invoice-footer">
              <div><strong>Account Name:</strong> {company?.company_account_name}</div>
              <div><strong>Account Number:</strong> {company?.company_account_number}</div>
              <div><strong>Bank:</strong> {company?.company_bank}</div>
            </div>
            
          
          </div>
          <button
              type="submit"
              style={{
                backgroundColor: company?.company_color,
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                marginTop: "20px"
              }}
            >
              Submit & Download
            </button>
        </form>
      </div>      
    </>
  );
};

export default InvoiceMain;