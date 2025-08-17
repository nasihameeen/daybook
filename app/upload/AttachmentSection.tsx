'use client';

import { useRef } from 'react';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'pdf' | 'other';
}

interface AttachmentSectionProps {
  attachments: UploadedFile[];
  setAttachments: (attachments: UploadedFile[]) => void;
}

export default function AttachmentSection({ attachments, setAttachments }: AttachmentSectionProps) {
  const attachmentInputRef = useRef<HTMLInputElement>(null);

  const handleAttachmentSelect = (files: FileList | null) => {
    if (!files) return;
    
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ];
    
    Array.from(files).forEach(file => {
      if (file.size > maxFileSize) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        return;
      }
      
      if (!allowedTypes.includes(file.type)) {
        alert(`File ${file.name} is not supported. Only PDF, images, and document files are allowed.`);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const newFile: UploadedFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          file,
          preview: e.target?.result as string,
          type: file.type.includes('pdf') ? 'pdf' : file.type.includes('image') ? 'image' : 'other'
        };
        setAttachments([...attachments, newFile]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter(file => file.id !== id));
  };

  const getFileIcon = (type: string, fileName: string) => {
    if (type === 'pdf') return 'ri-file-pdf-line';
    if (type === 'image') return 'ri-image-line';
    if (fileName.includes('.doc') || fileName.includes('.docx')) return 'ri-file-word-line';
    if (fileName.includes('.xls') || fileName.includes('.xlsx')) return 'ri-file-excel-line';
    if (fileName.includes('.txt')) return 'ri-file-text-line';
    return 'ri-file-line';
  };

  const getFileColor = (type: string, fileName: string) => {
    if (type === 'pdf') return 'text-red-600 bg-red-100';
    if (type === 'image') return 'text-green-600 bg-green-100';
    if (fileName.includes('.doc') || fileName.includes('.docx')) return 'text-blue-600 bg-blue-100';
    if (fileName.includes('.xls') || fileName.includes('.xlsx')) return 'text-green-600 bg-green-100';
    if (fileName.includes('.txt')) return 'text-gray-600 bg-gray-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Related Attachments</h2>
          <p className="text-sm text-gray-600">Upload supporting documents (delivery notes, contracts, etc.)</p>
        </div>
        <button
          onClick={() => attachmentInputRef.current?.click()}
          className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <i className="ri-attachment-line mr-2"></i>
          <span className="text-sm font-medium">Attach Files</span>
        </button>
      </div>

      {/* Hidden File Input */}
      <input
        ref={attachmentInputRef}
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.txt"
        onChange={(e) => handleAttachmentSelect(e.target.files)}
        className="hidden"
      />

      {/* Attachment Preview */}
      {attachments.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-900">Attached Files ({attachments.length})</h3>
          <div className="grid grid-cols-1 gap-2">
            {attachments.map((attachment) => (
              <div key={attachment.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                {attachment.type === 'image' ? (
                  <img 
                    src={attachment.preview} 
                    alt="Preview" 
                    className="w-12 h-12 object-cover rounded-lg" 
                  />
                ) : (
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    getFileColor(attachment.type, attachment.file.name)
                  }`}>
                    <i className={`${getFileIcon(attachment.type, attachment.file.name)} text-xl`}></i>
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {attachment.file.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {(attachment.file.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>

                <button
                  onClick={() => removeAttachment(attachment.id)}
                  className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                >
                  <i className="ri-close-line text-red-600"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <i className="ri-attachment-line text-4xl text-gray-400 mb-2"></i>
          <p className="text-sm text-gray-500 mb-2">No attachments added yet</p>
          <button
            onClick={() => attachmentInputRef.current?.click()}
            className="text-blue-600 text-sm font-medium hover:text-blue-700"
          >
            Click to attach supporting documents
          </button>
        </div>
      )}

      {/* Attachment Guidelines */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-start">
          <i className="ri-lightbulb-line text-blue-600 mr-2 mt-0.5"></i>
          <div className="text-xs text-blue-800">
            <p className="font-medium mb-1">Common Supporting Documents:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Delivery notes or shipping receipts</li>
              <li>Purchase orders or service agreements</li>
              <li>Quality certificates or inspection reports</li>
              <li>Email correspondence or communication records</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}