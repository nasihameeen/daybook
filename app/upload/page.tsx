'use client';

import { useState, useRef } from 'react';
import Header from '@/components/Header';
import TabBar from '@/components/TabBar';
import UploadButton from './UploadButton';
import DocumentClassification from './DocumentClassification';
import DocumentDetails from './DocumentDetails';
import PaymentSection from './PaymentSection';
import AttachmentSection from './AttachmentSection';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'pdf' | 'other';
}

interface Payment {
  id: string;
  amount: string;
  account: string;
}

interface PageFile {
  id: string;
  file: File;
  preview: string;
  pageNumber: number;
}

export default function UploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [multiPageMode, setMultiPageMode] = useState(false);
  const [capturedPages, setCapturedPages] = useState<PageFile[]>([]);
  
  // Document Classification
  const [documentType, setDocumentType] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState('');
  const [incomeExpense, setIncomeExpense] = useState('');
  const [internalReferenceNumber, setInternalReferenceNumber] = useState('');
  
  // Document Details
  const [documentNumber, setDocumentNumber] = useState('');
  const [documentDate, setDocumentDate] = useState('');
  const [partyName, setPartyName] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [totalAmount, setTotalAmount] = useState('');
  const [isVatInclusive, setIsVatInclusive] = useState(true);
  
  // Payment Section
  const [payments, setPayments] = useState<Payment[]>([
    { id: '1', amount: '', account: 'Cash' }
  ]);
  
  // Remarks and Attachments
  const [remarks, setRemarks] = useState('');
  const [attachments, setAttachments] = useState<UploadedFile[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    
    Array.from(files).forEach((file, index) => {
      if (file.size > maxFileSize) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return;
      }
      
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} is not supported. Only PDF, JPEG, and PNG files are allowed.`);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (multiPageMode) {
          const newPage: PageFile = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            file,
            preview: e.target?.result as string,
            pageNumber: capturedPages.length + index + 1
          };
          setCapturedPages(prev => [...prev, newPage]);
        } else {
          const newFile: UploadedFile = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            file,
            preview: e.target?.result as string,
            type: file.type.includes('pdf') ? 'pdf' : file.type.includes('image') ? 'image' : 'other'
          };
          setUploadedFiles(prev => [...prev, newFile]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleCameraCapture = (files: FileList | null) => {
    if (!files) return;
    
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      
      if (multiPageMode) {
        const newPage: PageFile = {
          id: Date.now().toString(),
          file,
          preview: imageUrl,
          pageNumber: capturedPages.length + 1
        };
        setCapturedPages(prev => [...prev, newPage]);
      } else {
        const newFile: UploadedFile = {
          id: Date.now().toString(),
          file,
          preview: imageUrl,
          type: 'image'
        };
        setUploadedFiles(prev => [...prev, newFile]);
      }
    };
    reader.readAsDataURL(file);
  };

  const movePageUp = (pageId: string) => {
    setCapturedPages(prev => {
      const pageIndex = prev.findIndex(p => p.id === pageId);
      if (pageIndex <= 0) return prev;
      
      const newPages = [...prev];
      [newPages[pageIndex - 1], newPages[pageIndex]] = [newPages[pageIndex], newPages[pageIndex - 1]];
      
      // Update page numbers
      return newPages.map((page, index) => ({
        ...page,
        pageNumber: index + 1
      }));
    });
  };

  const movePageDown = (pageId: string) => {
    setCapturedPages(prev => {
      const pageIndex = prev.findIndex(p => p.id === pageId);
      if (pageIndex >= prev.length - 1) return prev;
      
      const newPages = [...prev];
      [newPages[pageIndex], newPages[pageIndex + 1]] = [newPages[pageIndex + 1], newPages[pageIndex]];
      
      // Update page numbers
      return newPages.map((page, index) => ({
        ...page,
        pageNumber: index + 1
      }));
    });
  };

  const removePage = (pageId: string) => {
    setCapturedPages(prev => {
      const filtered = prev.filter(page => page.id !== pageId);
      return filtered.map((page, index) => ({
        ...page,
        pageNumber: index + 1
      }));
    });
  };

  const combinePagesToPDF = async () => {
    if (capturedPages.length === 0) return;
    
    // In a real implementation, you would use a PDF library like jsPDF
    // For now, we'll simulate the process
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setMultiPageMode(false);
          
          // Create a simulated PDF file
          const pdfFile = new File([''], `multi-page-document-${Date.now()}.pdf`, {
            type: 'application/pdf'
          });
          
          const newFile: UploadedFile = {
            id: Date.now().toString(),
            file: pdfFile,
            preview: '',
            type: 'pdf'
          };
          setUploadedFiles(prev => [...prev, newFile]);
          setCapturedPages([]);
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const addPayment = () => {
    const newPayment: Payment = {
      id: Date.now().toString(),
      amount: '',
      account: 'Cash'
    };
    setPayments(prev => [...prev, newPayment]);
  };

  const removePayment = (id: string) => {
    if (payments.length > 1) {
      setPayments(prev => prev.filter(payment => payment.id !== id));
    }
  };

  const updatePayment = (id: string, field: 'amount' | 'account', value: string) => {
    setPayments(prev => prev.map(payment => 
      payment.id === id ? { ...payment, [field]: value } : payment
    ));
  };

  const getTotalPayments = () => {
    return payments.reduce((sum, payment) => {
      const amount = parseFloat(payment.amount) || 0;
      return sum + amount;
    }, 0);
  };

  const handleSubmit = async () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload process
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          alert('Document uploaded successfully!');
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <>
      <Header />
      <main className="pt-20 pb-20 px-4 min-h-screen bg-gray-50">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Upload Document</h1>
            <p className="text-sm text-gray-600 mt-1">Upload and classify your financial documents</p>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Document Upload</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <UploadButton
                icon="ri-upload-2-line"
                title="Upload Files"
                description="PDF, JPEG, PNG (Max 10MB)"
                onClick={() => fileInputRef.current?.click()}
                color="bg-gradient-to-br from-blue-500 to-blue-600"
              />
              <UploadButton
                icon="ri-camera-line"
                title="Take Photo"
                description="Use device camera"
                onClick={() => cameraInputRef.current?.click()}
                color="bg-gradient-to-br from-green-500 to-green-600"
              />
            </div>

            {/* Multi-page Mode Toggle and Captured Pages - Single Line */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
              <div className="flex items-center space-x-4 w-3/4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Multi-page Document</h3>
                  <p className="text-xs text-gray-600">Capture multiple pages and combine into PDF</p>
                </div>
                <button
                  onClick={() => setMultiPageMode(!multiPageMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    multiPageMode ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      multiPageMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="w-1/4 flex items-center justify-end space-x-2">
                {multiPageMode && (
                  <>
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">{capturedPages.length}</div>
                      <div className="text-xs text-gray-600">Pages</div>
                    </div>
                    {capturedPages.length > 0 && (
                      <button
                        onClick={combinePagesToPDF}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium"
                      >
                        Combine
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Multi-page Pages Grid */}
            {multiPageMode && capturedPages.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-3">
                  {capturedPages.map((page) => (
                    <div key={page.id} className="relative bg-white rounded-lg p-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs font-medium text-blue-900">
                          Page {page.pageNumber}
                        </span>
                        <div className="flex items-center space-x-1 ml-auto">
                          <button
                            onClick={() => movePageUp(page.id)}
                            disabled={page.pageNumber === 1}
                            className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <i className="ri-arrow-up-s-line text-xs text-blue-600"></i>
                          </button>
                          <button
                            onClick={() => movePageDown(page.id)}
                            disabled={page.pageNumber === capturedPages.length}
                            className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <i className="ri-arrow-down-s-line text-xs text-blue-600"></i>
                          </button>
                          <button
                            onClick={() => removePage(page.id)}
                            className="w-6 h-6 bg-red-100 rounded flex items-center justify-center"
                          >
                            <i className="ri-close-line text-xs text-red-600"></i>
                          </button>
                        </div>
                      </div>
                      <img src={page.preview} alt={`Page ${page.pageNumber}`} className="w-full h-20 object-cover rounded" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hidden File Inputs */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={(e) => handleCameraCapture(e.target.files)}
              className="hidden"
            />

            {/* Upload Progress */}
            {isUploading && (
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-900">Processing...</span>
                  <span className="text-sm text-blue-700">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Uploaded Files Preview */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-900">Uploaded Files ({uploadedFiles.length})</h3>
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    {file.type === 'image' && (
                      <img src={file.preview} alt="Preview" className="w-12 h-12 object-cover rounded-lg" />
                    )}
                    {file.type === 'pdf' && (
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <i className="ri-file-pdf-line text-red-600 text-xl"></i>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{file.file.name}</div>
                      <div className="text-xs text-gray-500">{(file.file.size / 1024 / 1024).toFixed(2)} MB</div>
                    </div>
                    <button
                      onClick={() => removeFile(file.id)}
                      className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                    >
                      <i className="ri-close-line text-red-600"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Document Classification */}
          <DocumentClassification
            documentType={documentType}
            setDocumentType={setDocumentType}
            category={category}
            setCategory={setCategory}
            subcategory={subcategory}
            setSubcategory={setSubcategory}
            incomeExpense={incomeExpense}
            setIncomeExpense={setIncomeExpense}
            internalReferenceNumber={internalReferenceNumber}
            setInternalReferenceNumber={setInternalReferenceNumber}
          />

          {/* Document Details */}
          <DocumentDetails
            documentNumber={documentNumber}
            setDocumentNumber={setDocumentNumber}
            documentDate={documentDate}
            setDocumentDate={setDocumentDate}
            partyName={partyName}
            setPartyName={setPartyName}
            currency={currency}
            setCurrency={setCurrency}
            totalAmount={totalAmount}
            setTotalAmount={setTotalAmount}
            isVatInclusive={isVatInclusive}
            setIsVatInclusive={setIsVatInclusive}
          />

          {/* Payment Section */}
          <PaymentSection
            payments={payments}
            addPayment={addPayment}
            removePayment={removePayment}
            updatePayment={updatePayment}
            getTotalPayments={getTotalPayments}
            totalAmount={totalAmount}
          />

          {/* Remarks Section */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Remarks</h2>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add any additional notes or explanations about this document..."
              maxLength={500}
              className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={4}
            />
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500">Optional field for additional information</span>
              <span className="text-xs text-gray-500">{remarks.length}/500</span>
            </div>
          </div>

          {/* Attachment Section */}
          <AttachmentSection
            attachments={attachments}
            setAttachments={setAttachments}
          />

          {/* Submit Button */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <button
              onClick={handleSubmit}
              disabled={uploadedFiles.length === 0 || isUploading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isUploading ? 'Processing...' : 'Submit Document'}
            </button>
          </div>
        </div>
      </main>
      <TabBar />
    </>
  );
}