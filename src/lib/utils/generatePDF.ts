import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Booking } from '@/types/booking';

interface AutoTableOptions {
  head: string[][];
  body: string[][];
  startY: number;
  theme: 'plain' | 'striped' | 'grid';
  styles: any;
  headStyles: any;
  bodyStyles: any;
}

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: AutoTableOptions) => void;
  }
}

export const generateBookingPDF = (booking: Booking) => {
  const doc = new jsPDF();
  
  // Colors
  const primaryPurple = [139, 31, 168];
  const accentGold = [255, 215, 0];
  const textGray = [75, 85, 99];
  
  // Header
  doc.setFillColor(...primaryPurple);
  doc.rect(0, 0, 210, 60, 'F');
  
  // Company name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Silverline Technologies', 20, 25);
  
  // Booking reference
  doc.setFontSize(16);
  doc.text(`Booking: ${booking.booking_reference}`, 20, 40);
  
  // Status badge
  doc.setFillColor(...accentGold);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  const statusText = booking.status.toUpperCase();
  const statusWidth = doc.getTextWidth(statusText);
  doc.rect(150, 32, statusWidth + 10, 12, 'F');
  doc.text(statusText, 155, 40);
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Client Information Section
  let yPosition = 80;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Client Information', 20, yPosition);
  
  yPosition += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${booking.client_name}`, 20, yPosition);
  
  yPosition += 8;
  doc.text(`Email: ${booking.client_email}`, 20, yPosition);
  
  yPosition += 8;
  doc.text(`Phone: ${booking.client_phone}`, 20, yPosition);
  
  if (booking.company_name) {
    yPosition += 8;
    doc.text(`Company: ${booking.company_name}`, 20, yPosition);
  }
  
  // Event Information Section
  yPosition += 20;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Event Details', 20, yPosition);
  
  yPosition += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Event: ${booking.event_name}`, 20, yPosition);
  
  yPosition += 8;
  doc.text(`Type: ${booking.event_type}`, 20, yPosition);
  
  yPosition += 8;
  doc.text(`Date: ${booking.event_date}`, 20, yPosition);
  
  yPosition += 8;
  doc.text(`Time: ${booking.event_start_time} - ${booking.event_end_time}`, 20, yPosition);
  
  yPosition += 8;
  doc.text(`Venue: ${booking.venue_location}`, 20, yPosition);
  
  if (booking.venue_address) {
    yPosition += 8;
    doc.text(`Address: ${booking.venue_address}`, 20, yPosition);
  }
  
  if (booking.expected_attendees) {
    yPosition += 8;
    doc.text(`Expected Attendees: ${booking.expected_attendees}`, 20, yPosition);
  }
  
  // Services Table
  yPosition += 20;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Services Booked', 20, yPosition);
  
  yPosition += 10;
  
  const servicesData = booking.services.map((service, index) => [
    (index + 1).toString(),
    service,
    'Included'
  ]);
  
  (doc as any).autoTable({
    head: [['#', 'Service', 'Status']],
    body: servicesData,
    startY: yPosition,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 5,
    },
    headStyles: {
      fillColor: primaryPurple,
      textColor: 255,
      fontStyle: 'bold',
    },
    bodyStyles: {
      textColor: textGray,
    },
  });
  
  // Additional Information
  yPosition = (doc as any).lastAutoTable.finalY + 20;
  
  if (booking.special_requirements) {
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Special Requirements', 20, yPosition);
    
    yPosition += 10;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(booking.special_requirements, 170);
    doc.text(lines, 20, yPosition);
    yPosition += lines.length * 5;
  }
  
  // Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFillColor(...primaryPurple);
  doc.rect(0, pageHeight - 30, 210, 30, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Silverline Technologies - Professional Audiovisual Services', 20, pageHeight - 15);
  doc.text('Email: info@silverlinetech.com | Phone: +1-555-0123', 20, pageHeight - 8);
  
  // Save the PDF
  doc.save(`Booking_${booking.booking_reference}.pdf`);
};
