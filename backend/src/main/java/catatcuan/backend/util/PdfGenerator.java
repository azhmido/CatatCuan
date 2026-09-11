package catatcuan.backend.util;

import catatcuan.backend.dto.response.InvoiceItemResponse;
import catatcuan.backend.dto.response.InvoiceResponse;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import java.io.ByteArrayOutputStream;

public class PdfGenerator {

    private static final Font TITLE_FONT = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20);
    private static final Font HEADER_FONT = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
    private static final Font NORMAL_FONT = FontFactory.getFont(FontFactory.HELVETICA, 12);

    public static byte[] generate(InvoiceResponse invoice) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4, 36, 36, 54, 36);
            PdfWriter.getInstance(doc, out);
            doc.open();

            doc.add(buildTitle());
            doc.add(buildHeaderTable(invoice));
            doc.add(buildItemsTable(invoice));
            doc.add(buildSummaryTable(invoice));

            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Gagal generate PDF: " + e.getMessage(), e);
        }
    }

    private static Paragraph buildTitle() {
        Paragraph title = new Paragraph("INVOICE", TITLE_FONT);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(20);
        return title;
    }

    private static PdfPTable buildHeaderTable(InvoiceResponse invoice) throws DocumentException {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.getDefaultCell().setBorder(Rectangle.NO_BORDER);
        table.setSpacingAfter(20);

        String dueDate = invoice.getDueDate() != null ? invoice.getDueDate().toString() : "-";

        table.addCell(cell("Invoice Number: " + invoice.getInvoiceNumber()));
        table.addCell(cell("Status: " + invoice.getStatus().name()));
        table.addCell(cell("Client: " + invoice.getClientName()));
        table.addCell(cell("Due Date: " + dueDate));

        return table;
    }

    private static PdfPTable buildItemsTable(InvoiceResponse invoice) throws DocumentException {
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{4f, 1f, 2f, 2f});
        table.setSpacingBefore(10);

        for (String header : new String[]{"Deskripsi", "Qty", "Harga Satuan", "Total"}) {
            PdfPCell cell = new PdfPCell(new Phrase(header, HEADER_FONT));
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setPadding(5);
            table.addCell(cell);
        }

        if (invoice.getItems() != null) {
            for (InvoiceItemResponse item : invoice.getItems()) {
                table.addCell(paddedCell(item.getDescription(), Element.ALIGN_LEFT));
                table.addCell(paddedCell(String.valueOf(item.getQty()), Element.ALIGN_CENTER));
                table.addCell(paddedCell(item.getUnitPrice().toPlainString(), Element.ALIGN_RIGHT));
                table.addCell(paddedCell(item.getLineTotal().toPlainString(), Element.ALIGN_RIGHT));
            }
        }

        return table;
    }

    private static PdfPTable buildSummaryTable(InvoiceResponse invoice) throws DocumentException {
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{7f, 2f});
        table.setSpacingBefore(15);

        table.addCell(labelCell("Subtotal:"));
        table.addCell(valueCell(invoice.getSubtotal().toPlainString(), NORMAL_FONT));
        table.addCell(labelCell("Total:"));
        table.addCell(valueCell(invoice.getTotal().toPlainString(), HEADER_FONT));

        return table;
    }

    private static PdfPCell cell(String text) {
        PdfPCell c = new PdfPCell(new Phrase(text, NORMAL_FONT));
        c.setBorder(Rectangle.NO_BORDER);
        return c;
    }

    private static PdfPCell paddedCell(String text, int alignment) {
        PdfPCell c = new PdfPCell(new Phrase(text, NORMAL_FONT));
        c.setHorizontalAlignment(alignment);
        c.setPadding(5);
        return c;
    }

    private static PdfPCell labelCell(String text) {
        PdfPCell c = new PdfPCell(new Phrase(text, HEADER_FONT));
        c.setHorizontalAlignment(Element.ALIGN_RIGHT);
        c.setBorder(Rectangle.NO_BORDER);
        return c;
    }

    private static PdfPCell valueCell(String text, Font font) {
        PdfPCell c = new PdfPCell(new Phrase(text, font));
        c.setHorizontalAlignment(Element.ALIGN_RIGHT);
        c.setBorder(Rectangle.NO_BORDER);
        return c;
    }
}
