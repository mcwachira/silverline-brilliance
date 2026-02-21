import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
  pdf,
} from "@react-pdf/renderer";
import type { Quote } from "@/types/admin";

Font.register({
  family: "Helvetica",
  fonts: [
    { src: "Helvetica" },
    { src: "Helvetica-Bold", fontWeight: "bold" },
  ],
});

// ── Color tokens (mirrored from CSS vars) ────────────────────────
const color = {
  bg:       "#1a1428",
  surface:  "#231c34",
  surface2: "#2c2242",
  border:   "#3d3455",
  purple:   "#7c3aed",
  gold:     "#d4a017",
  goldLight:"#f0c040",
  text:     "#f0edf8",
  muted:    "#a89ec8",
  faint:    "#6b5f84",
  success:  "#22c55e",
  danger:   "#ef4444",
};

// ── Styles ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    backgroundColor: color.bg,
    color: color.text,
    padding: 0,
    fontSize: 9,
  },
  // Header band
  header: {
    backgroundColor: color.surface,
    borderBottom: `1px solid ${color.border}`,
    padding: "28 36 24 36",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: { flexDirection: "column", gap: 4 },
  logo: { width: 44, height: 44, borderRadius: 8, objectFit: "contain", marginBottom: 8 },
  logoPlaceholder: {
    width: 44, height: 44, borderRadius: 8,
    backgroundColor: color.purple, alignItems: "center", justifyContent: "center",
  },
  logoPlaceholderText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  companyName: { fontSize: 14, fontWeight: "bold", color: color.text, marginBottom: 2 },
  companyMeta: { fontSize: 8, color: color.muted, lineHeight: 1.5 },
  headerRight: { alignItems: "flex-end", gap: 4 },
  quoteLabel: {
    fontSize: 22, fontWeight: "bold",
    color: color.goldLight, letterSpacing: 2, marginBottom: 6,
  },
  quoteRef: {
    fontSize: 10, color: color.muted,
    padding: "3 10", borderRadius: 99,
    backgroundColor: color.surface2,
    border: `1px solid ${color.border}`,
    textAlign: "center",
  },
  statusChip: {
    fontSize: 8, fontWeight: "bold",
    padding: "3 9", borderRadius: 99, marginTop: 4,
  },

  // Meta grid
  meta: {
    flexDirection: "row",
    padding: "18 36",
    gap: 12,
    borderBottom: `1px solid ${color.border}`,
  },
  metaCard: {
    flex: 1, backgroundColor: color.surface2,
    border: `1px solid ${color.border}`,
    borderRadius: 8, padding: "12 14",
  },
  metaLabel: { fontSize: 7, fontWeight: "bold", color: color.faint, textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 },
  metaValue: { fontSize: 9, color: color.text, fontWeight: "bold", marginBottom: 1 },
  metaSmall: { fontSize: 8, color: color.muted },

  // Items table
  tableSection: { padding: "20 36 0" },
  tableSectionTitle: { fontSize: 9, fontWeight: "bold", color: color.faint, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: color.surface2,
    borderRadius: "6 6 0 0",
    border: `1px solid ${color.border}`,
    padding: "8 14",
  },
  tableHeaderText: { fontSize: 7, fontWeight: "bold", color: color.faint, textTransform: "uppercase", letterSpacing: 1 },
  tableRow: {
    flexDirection: "row",
    padding: "10 14",
    borderLeft: `1px solid ${color.border}`,
    borderRight: `1px solid ${color.border}`,
    borderBottom: `1px solid ${color.border}`,
    alignItems: "center",
  },
  tableRowAlt: { backgroundColor: "rgba(255,255,255,0.02)" },
  cellDesc: { flex: 4, fontSize: 9, color: color.text },
  cellRight: { flex: 1, fontSize: 9, color: color.muted, textAlign: "right" },
  cellRightBold: { flex: 1, fontSize: 9, color: color.text, fontWeight: "bold", textAlign: "right" },

  // Totals
  totalsSection: { padding: "0 36 20" },
  totalsRow: {
    flexDirection: "row", justifyContent: "flex-end", alignItems: "center",
    padding: "5 14",
  },
  totalsLabel: { fontSize: 9, color: color.muted, width: 100, textAlign: "right", marginRight: 24 },
  totalsValue: { fontSize: 9, color: color.muted, width: 70, textAlign: "right" },
  totalsDivider: {
    height: 1, backgroundColor: color.border,
    marginHorizontal: 36, marginVertical: 6,
  },
  grandTotalLabel: { fontSize: 11, color: color.text, fontWeight: "bold", width: 100, textAlign: "right", marginRight: 24 },
  grandTotalValue: { fontSize: 11, color: color.goldLight, fontWeight: "bold", width: 70, textAlign: "right" },

  // Notes / Terms
  notesSection: {
    flexDirection: "row", gap: 12,
    padding: "0 36 24",
  },
  notesCard: {
    flex: 1, backgroundColor: color.surface2,
    border: `1px solid ${color.border}`, borderRadius: 8, padding: "12 14",
  },
  notesLabel: { fontSize: 7, fontWeight: "bold", color: color.faint, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
  notesText: { fontSize: 8, color: color.muted, lineHeight: 1.6 },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    backgroundColor: color.surface,
    borderTop: `1px solid ${color.border}`,
    padding: "12 36",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: { fontSize: 7, color: color.faint },
  footerAccent: { fontSize: 7, color: color.gold, fontWeight: "bold" },
});

// ── Helpers ───────────────────────────────────────────────────────

function fmt(n: number) {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function statusStyle(status: string): object {
  const map: Record<string, { bg: string; color: string }> = {
    draft:    { bg: color.faint,   color: "#fff" },
    sent:     { bg: "#2563eb",     color: "#fff" },
    accepted: { bg: color.success, color: "#fff" },
    rejected: { bg: color.danger,  color: "#fff" },
    expired:  { bg: "#d97706",     color: "#fff" },
  };
  return map[status] ?? map.draft;
}

// ── Document component ────────────────────────────────────────────

interface QuotePDFDocumentProps {
  quote: Quote;
}

export function QuotePDFDocument({ quote }: QuotePDFDocumentProps) {
  const sstyle = statusStyle(quote.status);

  return (
    <Document
      title={`Quote ${quote.quote_number}`}
      author={quote.company_name}
      subject={`Quote for ${quote.client_name}`}
    >
      <Page size="A4" style={s.page}>

        {/* ── Header ─────────────────────────── */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            {quote.company_logo_url ? (
              <Image src={quote.company_logo_url} style={s.logo} />
            ) : (
              <View style={s.logoPlaceholder}>
                <Text style={s.logoPlaceholderText}>
                  {quote.company_name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <Text style={s.companyName}>{quote.company_name}</Text>
            <Text style={s.companyMeta}>
              {[quote.company_email, quote.company_phone, quote.company_address]
                .filter(Boolean).join(" · ")}
            </Text>
          </View>

          <View style={s.headerRight}>
            <Text style={s.quoteLabel}>QUOTE</Text>
            <Text style={s.quoteRef}>{quote.quote_number}</Text>
            <View style={[s.statusChip, { backgroundColor: sstyle.bg as string }]}>
              <Text style={{ color: sstyle.color as string, fontSize: 7, fontWeight: "bold", textTransform: "uppercase" }}>
                {quote.status}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Meta cards ─────────────────────── */}
        <View style={s.meta}>
          {/* Billed To */}
          <View style={s.metaCard}>
            <Text style={s.metaLabel}>Billed To</Text>
            <Text style={s.metaValue}>{quote.client_name}</Text>
            {quote.client_company && <Text style={s.metaSmall}>{quote.client_company}</Text>}
            {quote.client_email   && <Text style={s.metaSmall}>{quote.client_email}</Text>}
          </View>

          {/* Issue Date */}
          <View style={s.metaCard}>
            <Text style={s.metaLabel}>Issue Date</Text>
            <Text style={s.metaValue}>
              {new Date(quote.issue_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </Text>
          </View>

          {/* Valid Until */}
          <View style={s.metaCard}>
            <Text style={s.metaLabel}>Valid Until</Text>
            <Text style={s.metaValue}>
              {quote.valid_until
                ? new Date(quote.valid_until).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
                : "—"}
            </Text>
          </View>

          {/* Total */}
          <View style={[s.metaCard, { borderColor: color.gold }]}>
            <Text style={s.metaLabel}>Total Amount</Text>
            <Text style={[s.metaValue, { fontSize: 14, color: color.goldLight }]}>{fmt(quote.total)}</Text>
          </View>
        </View>

        {/* ── Line items table ────────────────── */}
        <View style={s.tableSection}>
          <Text style={s.tableSectionTitle}>Services & Pricing</Text>

          <View style={s.tableHeader}>
            <Text style={[s.tableHeaderText, { flex: 4 }]}>Description</Text>
            <Text style={[s.tableHeaderText, { flex: 1, textAlign: "right" }]}>Qty</Text>
            <Text style={[s.tableHeaderText, { flex: 1, textAlign: "right" }]}>Unit Price</Text>
            <Text style={[s.tableHeaderText, { flex: 1, textAlign: "right" }]}>Total</Text>
          </View>

          {quote.line_items.map((item, i) => (
            <View key={item.id} style={[s.tableRow, i % 2 === 1 ? s.tableRowAlt : {}]}>
              <Text style={s.cellDesc}>{item.description}</Text>
              <Text style={s.cellRight}>{item.quantity}</Text>
              <Text style={s.cellRight}>{fmt(item.unitPrice)}</Text>
              <Text style={s.cellRightBold}>{fmt(item.total)}</Text>
            </View>
          ))}
        </View>

        {/* ── Totals ─────────────────────────── */}
        <View style={s.totalsSection}>
          <View style={s.totalsRow}>
            <Text style={s.totalsLabel}>Subtotal</Text>
            <Text style={s.totalsValue}>{fmt(quote.subtotal)}</Text>
          </View>
          {quote.discount > 0 && (
            <View style={s.totalsRow}>
              <Text style={s.totalsLabel}>Discount ({quote.discount}%)</Text>
              <Text style={[s.totalsValue, { color: color.success }]}>-{fmt(quote.discount_amount)}</Text>
            </View>
          )}
          {quote.tax > 0 && (
            <View style={s.totalsRow}>
              <Text style={s.totalsLabel}>Tax ({quote.tax}%)</Text>
              <Text style={s.totalsValue}>{fmt(quote.tax_amount)}</Text>
            </View>
          )}
          <View style={s.totalsDivider} />
          <View style={s.totalsRow}>
            <Text style={s.grandTotalLabel}>Total</Text>
            <Text style={s.grandTotalValue}>{fmt(quote.total)}</Text>
          </View>
        </View>

        {/* ── Notes / Payment Terms ───────────── */}
        {(quote.notes || quote.payment_terms) && (
          <View style={s.notesSection}>
            {quote.notes && (
              <View style={s.notesCard}>
                <Text style={s.notesLabel}>Notes & Terms</Text>
                <Text style={s.notesText}>{quote.notes}</Text>
              </View>
            )}
            {quote.payment_terms && (
              <View style={s.notesCard}>
                <Text style={s.notesLabel}>Payment Terms</Text>
                <Text style={s.notesText}>{quote.payment_terms}</Text>
              </View>
            )}
          </View>
        )}

        {/* ── Footer ─────────────────────────── */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>
            Generated by <Text style={s.footerAccent}>{quote.company_name}</Text>
          </Text>
          <Text style={s.footerText}>{quote.quote_number} · {quote.issue_date}</Text>
          <Text style={s.footerText} render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          } />
        </View>

      </Page>
    </Document>
  );
}

// ── Utility: trigger download ─────────────────────────────────────
// Call this from a client component onClick handler.

export async function downloadQuotePDF(quote: Quote): Promise<void> {
  const blob = await pdf(<QuotePDFDocument quote={quote} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `quote-${quote.quote_number.toLowerCase().replace(/\s/g, "-")}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
