import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { QuoteData } from '@/types/booking';

// Extend jsPDF types for autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: { finalY: number };
  }
}

// ============================================================
// TEMPLATE COLORS
// ============================================================

const templates = {
  modern: {
    primary: [139, 31, 168],      // Purple
    accent: [255, 215, 0],         // Gold
    dark: [45, 27, 61],            // Dark purple
    lightBg: [249, 250, 251],      // Light gray
    text: [31, 41, 55],            // Dark gray
    border: [229, 231, 235],       // Light border
  },
  classic: {
    primary: [30, 64, 175],        // Navy blue
    accent: [16, 185, 129],        // Green
    dark: [31, 41, 55],            // Dark gray
    lightBg: [243, 244, 246],      // Light gray
    text: [55, 65, 81],            // Medium gray
    border: [209, 213, 219],       // Border gray
  },
  minimal: {
    primary: [0, 0, 0],            // Black
    accent: [107, 114, 128],       // Medium gray
    dark: [17, 24, 39],            // Very dark gray
    lightBg: [255, 255, 255],      // White
    text: [31, 41, 55],            // Dark gray
    border: [229, 231, 235],       // Light border
  },
};

// ============================================================
// HEADER FUNCTIONS
// ============================================================

function createModernHeader(doc: jsPDF, quoteData: QuoteData, colors: any) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Colored header background
  doc.setFillColor(...colors.primary);
  doc.rect(0, 0, pageWidth, 50, 'F');
  
  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Silverline Technologies', 20, 20);
  
  // Tagline
  doc.setTextColor(...colors.accent);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Professional Audiovisual Services', 20, 30);
  
  // Quote label
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('QUOTATION', pageWidth - 20, 20, { align: 'right' });
  
  // Quote details
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Quote #: ${quoteData.quote_number}`, pageWidth - 20, 30, { align: 'right' });
  doc.text(`Date: ${quoteData.quote_date}`, pageWidth - 20, 37, { align: 'right' });
  doc.text(`Valid Until: ${quoteData.valid_until}`, pageWidth - 20, 44, { align: 'right' });
}

function createClassicHeader(doc: jsPDF, quoteData: QuoteData, colors: any) {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Top border line
  doc.setDrawColor(...colors.primary);
  doc.setLineWidth(3);
  doc.line(20, 15, pageWidth - 20, 15);
  
  // Company name
  doc.setTextColor(...colors.primary);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('SILVERLINE TECHNOLOGIES', 20, 25);
  
  // Tagline
  doc.setTextColor(...colors.text);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Professional Audiovisual Services', 20, 32);
  
  // Contact info
  doc.setFontSize(8);
  doc.text('Email: info@silverlinetech.com | Phone: +1-555-0123', 20, 38);
  
  // Quote box
  doc.setFillColor(...colors.lightBg);
  doc.setDrawColor(...colors.border);
  doc.setLineWidth(0.5);
  doc.rect(pageWidth - 75, 18, 55, 25, 'FD');
  
  doc.setTextColor(...colors.text);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('QUOTATION', pageWidth - 72, 25);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Quote #: ${quoteData.quote_number}`, pageWidth - 72, 31);
  doc.text(`Date: ${quoteData.quote_date}`, pageWidth - 72, 36);
  doc.text(`Valid Until: ${quoteData.valid_until}`, pageWidth - 72, 41);
}

function createMinimalHeader(doc: jsPDF, quoteData: QuoteData, colors: any) {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Company name
  doc.setTextColor(...colors.primary);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('SILVERLINE TECHNOLOGIES', 20, 20);
  
  // Quote info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('QUOTATION', pageWidth - 20, 20, { align: 'right' });
  doc.text(quoteData.quote_number, pageWidth - 20, 27, { align: 'right' });
  
  // Separator line
  doc.setDrawColor(...colors.border);
  doc.setLineWidth(0.3);
  doc.line(20, 32, pageWidth - 20, 32);
  
  // Date info
  doc.setTextColor(...colors.accent);
  doc.setFontSize(8);
  doc.text(`Date: ${quoteData.quote_date}`, pageWidth - 20, 37, { align: 'right' });
  doc.text(`Valid Until: ${quoteData.valid_until}`, pageWidth - 20, 42, { align: 'right' });
}

// ============================================================
// FOOTER FUNCTION
// ============================================================

function createFooter(doc: jsPDF, colors: any, template: string) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageNum = (doc as any).internal.getCurrentPageInfo().pageNumber;
  
  if (template === 'modern') {
    // Colored footer
    doc.setFillColor(...colors.dark);
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Silverline Technologies | info@silverlinetech.com | +1-555-0123', 20, pageHeight - 10);
    
    doc.setTextColor(...colors.accent);
    doc.text(`Page ${pageNum}`, pageWidth - 20, pageHeight - 10, { align: 'right' });
  } else {
    // Simple footer
    doc.setDrawColor(...colors.border);
    doc.setLineWidth(0.3);
    doc.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);
    
    doc.setTextColor(...colors.text);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(
      'Silverline Technologies | info@silverlinetech.com | +1-555-0123',
      pageWidth / 2,
      pageHeight - 12,
      { align: 'center' }
    );
    doc.text(`Page ${pageNum}`, pageWidth - 20, pageHeight - 12, { align: 'right' });
  }
}

// ============================================================
// MAIN PDF GENERATION FUNCTION
// ============================================================

export function generateQuotePDF(quoteData: QuoteData): jsPDF {
  const template = quoteData.template || 'modern';
  const colors = templates[template as keyof typeof templates];
  
  // Create PDF
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter',
  });
  
  // Add header
  if (template === 'modern') {
    createModernHeader(doc, quoteData, colors);
  } else if (template === 'classic') {
    createClassicHeader(doc, quoteData, colors);
  } else {
    createMinimalHeader(doc, quoteData, colors);
  }
  
  let yPos = template === 'modern' ? 60 : 55;
  
  // ============================================================
  // CLIENT INFORMATION
  // ============================================================
  
  doc.setTextColor(...colors.primary);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 20, yPos);
  
  yPos += 7;
  doc.setTextColor(...colors.text);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(quoteData.client_name, 20, yPos);
  
  yPos += 5;
  doc.setFont('helvetica', 'normal');
  
  if (quoteData.client_company) {
    doc.text(quoteData.client_company, 20, yPos);
    yPos += 5;
  }
  
  doc.text(quoteData.client_email, 20, yPos);
  yPos += 5;
  doc.text(quoteData.client_phone, 20, yPos);
  yPos += 5;
  
  if (quoteData.client_address) {
    doc.text(quoteData.client_address, 20, yPos);
    yPos += 5;
  }
  
  yPos += 5;
  
  // ============================================================
  // EVENT INFORMATION
  // ============================================================
  
  doc.setTextColor(...colors.primary);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Event Details:', 20, yPos);
  
  yPos += 7;
  doc.setTextColor(...colors.text);
  doc.setFontSize(9);
  
  const eventInfo = [
    ['Event Name:', quoteData.event_name],
    ['Event Type:', quoteData.event_type],
    ['Event Date:', quoteData.event_date],
    ['Venue:', quoteData.venue_name],
  ];
  
  if (quoteData.venue_address) {
    eventInfo.push(['Venue Address:', quoteData.venue_address]);
  }
  
  doc.autoTable({
    startY: yPos,
    head: [],
    body: eventInfo,
    theme: 'plain',
    styles: {
      fontSize: 9,
      cellPadding: 1,
      textColor: colors.text,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 35 },
      1: { cellWidth: 'auto' },
    },
    margin: { left: 20 },
  });
  
  yPos = doc.lastAutoTable.finalY + 10;
  
  // ============================================================
  // LINE ITEMS TABLE
  // ============================================================
  
  doc.setTextColor(...colors.primary);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Services & Equipment:', 20, yPos);
  
  yPos += 5;
  
  const tableData = quoteData.line_items.map((item, index) => [
    (index + 1).toString(),
    item.description,
    item.quantity.toString(),
    `$${item.unit_price.toFixed(2)}`,
    `$${item.total.toFixed(2)}`,
  ]);
  
  doc.autoTable({
    startY: yPos,
    head: [['#', 'Description', 'Qty', 'Unit Price', 'Total']],
    body: tableData,
    foot: [
      ['', '', '', 'Subtotal:', `$${quoteData.subtotal.toFixed(2)}`],
      ['', '', '', `Tax (${(quoteData.tax_rate * 100).toFixed(1)}%):`, `$${quoteData.tax_amount.toFixed(2)}`],
      ['', '', '', 'TOTAL:', `$${quoteData.total.toFixed(2)}`],
    ],
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 3,
      textColor: colors.text,
    },
    headStyles: {
      fillColor: colors.primary,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 90 },
      2: { cellWidth: 15, halign: 'center' },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 25, halign: 'right' },
    },
    footStyles: {
      fillColor: colors.lightBg,
      textColor: colors.text,
      fontStyle: 'bold',
      halign: 'right',
    },
    didParseCell: function (data) {
      // Make the last footer row (TOTAL) more prominent
      if (data.section === 'foot' && data.row.index === 2) {
        data.cell.styles.fontSize = 11;
        data.cell.styles.fillColor = colors.primary;
        data.cell.styles.textColor = [255, 255, 255];
      }
    },
    margin: { left: 20, right: 20 },
  });
  
  yPos = doc.lastAutoTable.finalY + 10;
  
  // ============================================================
  // NOTES AND TERMS
  // ============================================================
  
  const pageHeight = doc.internal.pageSize.getHeight();
  const bottomMargin = template === 'modern' ? 30 : 25;
  
  // Check if we need a new page
  if (yPos > pageHeight - bottomMargin - 40) {
    doc.addPage();
    yPos = 20;
  }
  
  if (quoteData.notes) {
    doc.setTextColor(...colors.primary);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Notes:', 20, yPos);
    
    yPos += 7;
    doc.setTextColor(...colors.text);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    
    const notesLines = doc.splitTextToSize(quoteData.notes, 170);
    doc.text(notesLines, 20, yPos);
    yPos += notesLines.length * 5 + 5;
  }
  
  // Check again for terms
  if (yPos > pageHeight - bottomMargin - 30) {
    doc.addPage();
    yPos = 20;
  }
  
  doc.setTextColor(...colors.primary);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Terms & Conditions:', 20, yPos);
  
  yPos += 7;
  doc.setTextColor(...colors.text);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  
  const terms = quoteData.terms_and_conditions || `1. Quote is valid for 30 days from the date of issue.
2. 50% deposit required to secure booking.
3. Final payment due 7 days before the event.
4. Cancellations within 14 days of the event are non-refundable.
5. Prices are subject to change based on final requirements.`;
  
  const termsLines = doc.splitTextToSize(terms, 170);
  doc.text(termsLines, 20, yPos);
  
  // Add footer to all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    createFooter(doc, colors, template);
  }
  
  return doc;
}

// ============================================================
// HELPER FUNCTION FOR DOWNLOAD
// ============================================================

export function downloadQuotePDF(quoteData: QuoteData, filename?: string) {
  const doc = generateQuotePDF(quoteData);
  const finalFilename = filename || `Quote_${quoteData.quote_number}.pdf`;
  doc.save(finalFilename);
}

// ============================================================
// HELPER FUNCTION FOR BASE64 (for email attachments)
// ============================================================

export function getQuotePDFBase64(quoteData: QuoteData): string {
  const doc = generateQuotePDF(quoteData);
  return doc.output('dataurlstring').split(',')[1];
}

// ============================================================
// HELPER FUNCTION FOR BLOB (for uploading)
// ============================================================

export function getQuotePDFBlob(quoteData: QuoteData): Blob {
  const doc = generateQuotePDF(quoteData);
  return doc.output('blob');
}