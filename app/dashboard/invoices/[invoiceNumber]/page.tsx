// Define interfaces
interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  total: number;
}

interface CompanyInfo {
  name: string;
  address: string;
  website: string;
}

interface InvoiceProps {
  invoiceTo: string;
  phone: string;
  address: string;
  totalDue: number;
  invoiceNumber: string;
  invoiceDate: string;
  items: InvoiceItem[];
  subTotal: number;
  deliveryFee: number;
  paymentMethod: string;
  thankYouMessage?: string;
  adminName: string;
  qrCodeUrl?: string;
  companyInfo: CompanyInfo;
  logoUrl?: string;
}

// Server Component with Data Fetching
export default async function InvoicePage({ params }: { params: { invoiceNumber: string } }) {
  const { invoiceNumber } = params;

  // Simulate fetching data server-side (replace with your actual data source)
  const invoiceData: InvoiceProps = {
    invoiceTo: 'John Doe',
    phone: '+880 123 456 7890',
    address: '123 Dhaka Street, Dhaka, Bangladesh',
    totalDue: 1500,
    invoiceNumber: invoiceNumber || 'INV-001',
    invoiceDate: 'February 23, 2025',
    items: [
      { description: 'Web Design Service', quantity: 1, price: 1000, total: 1000 },
      { description: 'Consulting Fee', quantity: 2, price: 250, total: 500 },
    ],
    subTotal: 1500,
    deliveryFee: 0,
    paymentMethod: 'Bank Transfer',
    thankYouMessage: 'Thank you for your business!',
    adminName: 'Jane Smith',
    qrCodeUrl: '/techtideqr.png', // Replace with actual URL
    companyInfo: {
      name: 'xAI Solutions',
      address: '456 Tech Road, Dhaka, Bangladesh',
      website: 'https://xai.com',
    },
    logoUrl: '/techtidelogo.png', // Replace with actual URL
  };

  // In a real app, fetch data like this:
  // const response = await fetch(`https://your-api.com/invoices/${invoiceNumber}`);
  // const invoiceData: InvoiceProps = await response.json();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-2xl font-lora relative" role="document">
      {invoiceData.logoUrl && (
        <img
          src={invoiceData.logoUrl}
          alt="Watermark Logo"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 z-0 pointer-events-none"
          style={{ width: '200px', height: 'auto' }}
        />
      )}
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-8 border-b-2 border-gray-200 pb-4 bg-white/80 backdrop-blur-sm rounded-t-lg">
          <h1 className="text-3xl font-bold text-blue-800 font-roboto">INVOICE</h1>
          <div className="text-sm text-gray-600">
            {invoiceData.logoUrl ? (
              <img src={invoiceData.logoUrl} alt="Company Logo" className="h-16 rounded-full shadow-md" />
            ) : (
              <div className="h-16 w-16 bg-gray-200 rounded-full shadow-md" aria-label="Placeholder for company logo" />
            )}
            <p className="mt-2 font-roboto text-gray-700">{invoiceData.companyInfo.name}</p>
          </div>
        </div>
        <div className="flex justify-between mb-8 bg-white/80 p-4 rounded-lg shadow-md">
          <div>
            <p className="text-lg font-medium text-blue-800 mb-2 font-roboto">INVOICE TO:</p>
            <p className="text-gray-700">{invoiceData.invoiceTo}</p>
            <p className="text-gray-700">P : {invoiceData.phone}</p>
            <p className="text-gray-700">A : {invoiceData.address}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-medium text-blue-800 mb-2 font-roboto">TOTAL DUE</p>
            <p className="text-2xl font-bold text-green-600">BDT : {invoiceData.totalDue} TAKA</p>
            <p className="text-gray-700">No : {invoiceData.invoiceNumber}</p>
            <p className="text-gray-700">Date : {invoiceData.invoiceDate}</p>
          </div>
        </div>
        <div className="mb-8 bg-white/80 p-4 rounded-lg shadow-md">
          <table className="w-full border-collapse" role="table">
            <thead>
              <tr className="bg-gray-100 rounded-t-lg">
                <th className="py-3 px-6 text-left text-blue-800 font-roboto font-semibold" scope="col">SERVICE</th>
                <th className="py-3 px-6 text-left text-blue-800 font-roboto font-semibold" scope="col">QTY</th>
                <th className="py-3 px-6 text-left text-blue-800 font-roboto font-semibold" scope="col">PRICE</th>
                <th className="py-3 px-6 text-left text-blue-800 font-roboto font-semibold" scope="col">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={item.description + index} className={index < invoiceData.items.length - 1 ? 'border-t border-gray-200' : ''}>
                  <td className="py-3 px-6 text-gray-700">{item.description}</td>
                  <td className="py-3 px-6 text-gray-700">{item.quantity}</td>
                  <td className="py-3 px-6 text-gray-700">{item.price}</td>
                  <td className="py-3 px-6 text-gray-700">{item.total}</td>
                </tr>
              ))}
              <tr className="border-t border-gray-200">
                <td className="py-3 px-6 text-gray-700 font-medium">Sub-total:</td>
                <td className="py-3 px-6"></td>
                <td className="py-3 px-6"></td>
                <td className="py-3 px-6 text-gray-700">{invoiceData.subTotal}</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-3 px-6 text-gray-700 font-medium">Delivery:</td>
                <td className="py-3 px-6"></td>
                <td className="py-3 px-6"></td>
                <td className="py-3 px-6 text-gray-700">{invoiceData.deliveryFee}</td>
              </tr>
              <tr className="border-t border-gray-200 bg-gray-100 rounded-b-lg">
                <td className="py-3 px-6 text-blue-800 font-roboto font-semibold">Total:</td>
                <td className="py-3 px-6"></td>
                <td className="py-3 px-6"></td>
                <td className="py-3 px-6 text-green-600 font-roboto font-bold">৳ {invoiceData.totalDue}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mb-8 bg-white/80 p-4 rounded-lg shadow-md">
          <p className="text-lg font-medium text-blue-800 mb-2 font-roboto">Payment Method:</p>
          <p className="text-gray-700">{invoiceData.paymentMethod}</p>
        </div>
        <div className="flex justify-between items-center border-t-2 border-gray-200 pt-6 mb-8 bg-white/80 p-4 rounded-lg shadow-md">
          <p className="text-gray-700">{invoiceData.thankYouMessage}</p>
          <p className="text-gray-700 font-roboto">{invoiceData.adminName}</p>
        </div>
        <div className="mt-8 text-center bg-white/80 p-4 rounded-lg shadow-md">
          {invoiceData.qrCodeUrl ? (
            <img src={invoiceData.qrCodeUrl} alt="QR Code for payment or contact" className="w-24 h-24 mx-auto mb-4 rounded-lg shadow-md" />
          ) : (
            <div className="w-24 h-24 bg-gray-200 mx-auto mb-4 rounded-lg shadow-md" aria-label="Placeholder for QR code" />
          )}
          <p className="text-gray-700 text-sm">
            {invoiceData.companyInfo.name}
            <br />
            {invoiceData.companyInfo.address}
            <br />
            {invoiceData.companyInfo.website}
          </p>
        </div>
      </div>
    </div>
  );
}