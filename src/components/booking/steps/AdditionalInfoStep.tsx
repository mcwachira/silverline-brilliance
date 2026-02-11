"use client";

import { useState } from "react";
import { Upload, DollarSign, MessageCircle, Mail, Phone } from "lucide-react";
import { BookingData } from "../BookingContext";

interface AdditionalInfoStepProps {
  data: BookingData;
  updateData: (updates: Partial<BookingData>) => void;
}

export default function AdditionalInfoStep({ data, updateData }: AdditionalInfoStepProps) {
  const [dragActive, setDragActive] = useState(false);

  const budgetRanges = [
    { value: "under-1000", label: "Under $1,000" },
    { value: "1000-5000", label: "$1,000 - $5,000" },
    { value: "5000-10000", label: "$5,000 - $10,000" },
    { value: "10000-25000", label: "$10,000 - $25,000" },
    { value: "25000+", label: "$25,000+" },
    { value: "custom", label: "Custom (contact for quote)" }
  ];

  const referralSources = [
    { value: "google", label: "Google Search" },
    { value: "social", label: "Social Media" },
    { value: "referral", label: "Referral" },
    { value: "previous", label: "Previous Client" },
    { value: "advertisement", label: "Advertisement" },
    { value: "other", label: "Other" }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const validFiles = Array.from(files).filter(file => {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
      const validSize = file.size <= 10 * 1024 * 1024; // 10MB
      return validTypes.includes(file.type) && validSize;
    });

    if (validFiles.length > 0) {
      updateData({ uploadedFiles: [...data.uploadedFiles, ...validFiles] });
    }
  };

  const removeFile = (index: number) => {
    const newFiles = data.uploadedFiles.filter((_, i) => i !== index);
    updateData({ uploadedFiles: newFiles });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
          <MessageCircle className="h-8 w-8 text-purple-600" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Additional Details</h3>
        <p className="text-muted-foreground">Help us understand your requirements better</p>
      </div>

      <div className="space-y-6">
        {/* Special Requirements */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Special Requirements
          </label>
          <textarea
            value={data.specialRequirements}
            onChange={(e) => updateData({ specialRequirements: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
            placeholder="Please describe any special requirements, accessibility needs, or specific requests for your event..."
          />
        </div>

        {/* Budget Range */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Budget Range
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
            <select
              value={data.budgetRange}
              onChange={(e) => updateData({ budgetRange: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none"
            >
              <option value="">Select budget range</option>
              {budgetRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* How did you hear about us */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            How did you hear about us?
          </label>
          <select
            value={data.referralSource}
            onChange={(e) => updateData({ referralSource: e.target.value })}
            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            <option value="">Please select</option>
            {referralSources.map((source) => (
              <option key={source.value} value={source.value}>
                {source.label}
              </option>
            ))}
          </select>
        </div>

        {/* Preferred Contact Method */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Preferred Contact Method
          </label>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="contactMethod"
                value="email"
                checked={data.contactMethod === "email"}
                onChange={(e) => updateData({ contactMethod: e.target.value })}
                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">Email</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="contactMethod"
                value="phone"
                checked={data.contactMethod === "phone"}
                onChange={(e) => updateData({ contactMethod: e.target.value })}
                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">Phone Call</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="contactMethod"
                value="whatsapp"
                checked={data.contactMethod === "whatsapp"}
                onChange={(e) => updateData({ contactMethod: e.target.value })}
                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">WhatsApp</span>
            </label>
          </div>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Upload event brief or reference materials <span className="text-muted-foreground text-xs">(Optional)</span>
          </label>
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-purple-500 bg-purple-50"
                : "border-border hover:border-purple-300"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground font-medium mb-2">
              Drag and drop your files here
            </p>
            <p className="text-muted-foreground text-sm mb-4">
              or click to browse
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              Accepts: PDF, DOC, DOCX, images (Max 10MB per file)
            </p>
          </div>

          {/* Uploaded Files */}
          {data.uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium text-foreground">Uploaded Files:</p>
              {data.uploadedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm text-foreground truncate">{file.name}</span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <p className="text-sm text-purple-700">
          <strong>Next Steps:</strong> After submitting this form, our team will review your requirements and contact you within 24 hours with a detailed quote.
        </p>
      </div>
    </div>
  );
}
