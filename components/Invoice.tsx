// components/Invoice.tsx
import React from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Define the interface for a single item in the items array
interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  total: number;
}

// Define the interface for company information
interface CompanyInfo {
  name: string;
  address: string;
  website: string;
}

// Define the props interface for the Invoice component
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
  qrCodeUrl?: string; // URL or path to QR code image
  companyInfo: CompanyInfo;
  logoUrl?: string; // URL or path to company logo
}

// Styles for the PDF
const pdfStyles = StyleSheet.create({
  page: {
    fontFamily: 'Lora',
    padding: 30,
    backgroundColor: '#f9fafb', // Light gray background
    fontSize: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 10,
  },
  title: {
    fontFamily: 'Roboto',
    fontSize: 24,
    color: '#1e3a8a', // Deep blue
    fontWeight: 'bold',
  },
  logo: {
    height: 60,
    width: 60,
  },
  section: {
    marginBottom: 20,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontFamily: 'Roboto',
    fontSize: 14,
    color: '#1e3a8a',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  value: {
    color: '#4a5568', // Gray
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableHeader: {
    backgroundColor: '#edf2f7', // Light gray
    padding: 10,
    fontFamily: 'Roboto',
    color: '#1e3a8a',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 10,
    color: '#4a5568',
  },
  totalRow: {
    backgroundColor: '#edf2f7',
    fontWeight: 'bold',
  },
  paymentMethod: {
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 2,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
    marginTop: 20,
  },
  qrCode: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: 0.1,
    zIndex: -1,
    width: 200,
  },
});

// PDF Document Component
const InvoicePDF: React.FC<InvoiceProps> = (props) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      {props.logoUrl && (
        <Image
          src={props.logoUrl}
          style={pdfStyles.watermark}
        />
      )}
      <View style={pdfStyles.header}>
        <Text style={pdfStyles.title}>INVOICE</Text>
        <View>
          {props.logoUrl ? (
            <Image src={props.logoUrl} style={pdfStyles.logo} />
          ) : (
            <View style={{ height: 60, width: 60, backgroundColor: '#e5e7eb' }} />
          )}
          <Text style={{ color: '#4a5568', fontSize: 10 }}>{props.companyInfo.name}</Text>
        </View>
      </View>

      <View style={pdfStyles.section}>
        <View style={pdfStyles.details}>
          <View>
            <Text style={pdfStyles.label}>INVOICE TO:</Text>
            <Text style={pdfStyles.value}>{props.invoiceTo}</Text>
            <Text style={pdfStyles.value}>P : {props.phone}</Text>
            <Text style={pdfStyles.value}>A : {props.address}</Text>
          </View>
          <View>
            <Text style={pdfStyles.label}>TOTAL DUE</Text>
            <Text style={[pdfStyles.value, { fontSize: 18, color: '#48bb78' }]}>BDT : {props.totalDue} TAKA</Text>
            <Text style={pdfStyles.value}>No : {props.invoiceNumber}</Text>
            <Text style={pdfStyles.value}>Date : {props.invoiceDate}</Text>
          </View>
        </View>
      </View>

      <View style={pdfStyles.table}>
        <View style={pdfStyles.tableRow}>
          <Text style={[pdfStyles.tableHeader, { flex: 2 }]}>SERVICE</Text>
          <Text style={[pdfStyles.tableHeader, { flex: 1 }]}>QTY</Text>
          <Text style={[pdfStyles.tableHeader, { flex: 1 }]}>PRICE</Text>
          <Text style={[pdfStyles.tableHeader, { flex: 1 }]}>TOTAL</Text>
        </View>
        {props.items.map((item, index) => (
          <View key={item.description + index} style={pdfStyles.tableRow}>
            <Text style={[pdfStyles.tableCell, { flex: 2 }]}>{item.description}</Text>
            <Text style={[pdfStyles.tableCell, { flex: 1 }]}>{item.quantity}</Text>
            <Text style={[pdfStyles.tableCell, { flex: 1 }]}>{item.price}</Text>
            <Text style={[pdfStyles.tableCell, { flex: 1 }]}>{item.total}</Text>
          </View>
        ))}
        <View style={[pdfStyles.tableRow, { borderBottomWidth: 0 }]}>
          <Text style={[pdfStyles.tableCell, { flex: 2, fontWeight: 'bold' }]}>Sub-total:</Text>
          <Text style={[pdfStyles.tableCell, { flex: 1 }]} />
          <Text style={[pdfStyles.tableCell, { flex: 1 }]} />
          <Text style={[pdfStyles.tableCell, { flex: 1 }]}>{props.subTotal}</Text>
        </View>
        <View style={[pdfStyles.tableRow, { borderBottomWidth: 0 }]}>
          <Text style={[pdfStyles.tableCell, { flex: 2, fontWeight: 'bold' }]}>Delivery:</Text>
          <Text style={[pdfStyles.tableCell, { flex: 1 }]} />
          <Text style={[pdfStyles.tableCell, { flex: 1 }]} />
          <Text style={[pdfStyles.tableCell, { flex: 1 }]}>{props.deliveryFee}</Text>
        </View>
        <View style={[pdfStyles.tableRow, pdfStyles.totalRow, { borderBottomWidth: 0 }]}>
          <Text style={[pdfStyles.tableCell, { flex: 2, fontFamily: 'Roboto', color: '#1e3a8a', fontWeight: 'bold' }]}>Total:</Text>
          <Text style={[pdfStyles.tableCell, { flex: 1 }]} />
          <Text style={[pdfStyles.tableCell, { flex: 1 }]} />
          <Text style={[pdfStyles.tableCell, { flex: 1, fontFamily: 'Roboto', color: '#48bb78', fontWeight: 'bold' }]}>৳ {props.totalDue}</Text>
        </View>
      </View>

      <View style={pdfStyles.paymentMethod}>
        <Text style={[pdfStyles.label, { marginBottom: 5 }]}>Payment Method:</Text>
        <Text style={pdfStyles.value}>{props.paymentMethod}</Text>
      </View>

      <View style={pdfStyles.footer}>
        <Text style={pdfStyles.value}>{props.thankYouMessage}</Text>
        <Text style={[pdfStyles.value, { fontFamily: 'Roboto' }]}>{props.adminName}</Text>
      </View>

      <View style={{ alignItems: 'center', marginTop: 20 }}>
        {props.qrCodeUrl ? (
          <Image src={props.qrCodeUrl} style={pdfStyles.qrCode} />
        ) : (
          <View style={{ width: 60, height: 60, backgroundColor: '#e5e7eb' }} />
        )}
        <Text style={pdfStyles.value}>
          {props.companyInfo.name}
          {'\n'}
          {props.companyInfo.address}
          {'\n'}
          {props.companyInfo.website}
        </Text>
      </View>
    </Page>
  </Document>
);

const Invoice: React.FC<InvoiceProps> = (props) => {
  // const handleDownloadPDF = useCallback(() => {
  //   // This function can be used if needed for custom handling, but PDFDownloadLink handles it automatically
  // }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-white to-gray-50 shadow-xl rounded-2xl font-lora relative" role="document">
      {/* Watermark (Low-opacity logo in the background) */}
      {props.logoUrl && (
        <img
          src={props.logoUrl}
          alt="Watermark Logo"
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 z-0 pointer-events-none"
          style={{ width: '200px', height: 'auto' }}
        />
      )}

      {/* Content (with higher z-index to stay above watermark) */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b-2 border-gray-200 pb-4 bg-white/80 backdrop-blur-sm rounded-t-lg">
          <h1 className="text-3xl font-bold text-blue-800 font-roboto">INVOICE</h1>
          <div className="text-sm text-gray-600">
            {props.logoUrl ? (
              <img src={props.logoUrl} alt="Company Logo" className="h-16 rounded-full shadow-md" />
            ) : (
              <div className="h-16 w-16 bg-gray-200 rounded-full shadow-md" aria-label="Placeholder for company logo" />
            )}
            <p className="mt-2 font-roboto text-gray-700">{props.companyInfo.name}</p>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="flex justify-between mb-8 bg-white/80 p-4 rounded-lg shadow-md">
          <div>
            <p className="text-lg font-medium text-blue-800 mb-2 font-roboto">INVOICE TO:</p>
            <p className="text-gray-700">{props.invoiceTo}</p>
            <p className="text-gray-700">P : {props.phone}</p>
            <p className="text-gray-700">A : {props.address}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-medium text-blue-800 mb-2 font-roboto">TOTAL DUE</p>
            <p className="text-2xl font-bold text-green-600">BDT : {props.totalDue} TAKA</p>
            <p className="text-gray-700">No : {props.invoiceNumber}</p>
            <p className="text-gray-700">Date : {props.invoiceDate}</p>
          </div>
        </div>

        {/* Table Section */}
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
              {props.items.map((item, index) => (
                <tr key={item.description + index} className={index < props.items.length - 1 ? 'border-t border-gray-200' : ''}>
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
                <td className="py-3 px-6 text-gray-700">{props.subTotal}</td>
              </tr>
              <tr className="border-t border-gray-200">
                <td className="py-3 px-6 text-gray-700 font-medium">Delivery:</td>
                <td className="py-3 px-6"></td>
                <td className="py-3 px-6"></td>
                <td className="py-3 px-6 text-gray-700">{props.deliveryFee}</td>
              </tr>
              <tr className="border-t border-gray-200 bg-gray-100 rounded-b-lg">
                <td className="py-3 px-6 text-blue-800 font-roboto font-semibold">Total:</td>
                <td className="py-3 px-6"></td>
                <td className="py-3 px-6"></td>
                <td className="py-3 px-6 text-green-600 font-roboto font-bold">৳ {props.totalDue}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payment Method */}
        <div className="mb-8 bg-white/80 p-4 rounded-lg shadow-md">
          <p className="text-lg font-medium text-blue-800 mb-2 font-roboto">Payment Method:</p>
          <p className="text-gray-700">{props.paymentMethod}</p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center border-t-2 border-gray-200 pt-6 mb-8 bg-white/80 p-4 rounded-lg shadow-md">
          <p className="text-gray-700">{props.thankYouMessage}</p>
          <p className="text-gray-700 font-roboto">{props.adminName}</p>
        </div>

        {/* QR Code and Contact Info */}
        <div className="mt-8 text-center bg-white/80 p-4 rounded-lg shadow-md">
          {props.qrCodeUrl ? (
            <img src={props.qrCodeUrl} alt="QR Code for payment or contact" className="w-24 h-24 mx-auto mb-4 rounded-lg shadow-md" />
          ) : (
            <div className="w-24 h-24 bg-gray-200 mx-auto mb-4 rounded-lg shadow-md" aria-label="Placeholder for QR code" />
          )}
          <p className="text-gray-700 text-sm">
            {props.companyInfo.name}<br />
            {props.companyInfo.address}<br />
            {props.companyInfo.website}
          </p>
        </div>

        {/* PDF Download Button */}
        <div className="mt-8 text-center">
          <PDFDownloadLink
            document={<InvoicePDF {...props} />}
            fileName={`invoice_${props.invoiceNumber}.pdf`}
            className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:from-green-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-roboto font-semibold transition-all duration-300"
            aria-label="Download invoice as PDF"
          >
            {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
};

export default Invoice;