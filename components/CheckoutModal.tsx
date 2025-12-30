
import ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction } from '../types';
import { formatPrice } from '../utils';

export const exportToExcel = async (transactions: Transaction[]) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('COMPTABILITÉ KOBLOGIX', {
    views: [{ state: 'frozen', ySplit: 7 }],
    properties: { tabColor: { argb: 'FF0077B6' } }
  });

  // --- CONFIGURATION DES COLONNES ---
  sheet.columns = [
    { header: 'ID', key: 'id', width: 15 },
    { header: 'DATE', key: 'date', width: 12 },
    { header: 'CLIENT', key: 'name', width: 25 },
    { header: 'TÉLÉPHONE', key: 'phone', width: 15 },
    { header: 'EMAIL', key: 'email', width: 25 },
    { header: 'RÉF. PAIEMENT', key: 'paymentRef', width: 20 },
    { header: 'MÉTHODE', key: 'method', width: 12 },
    { header: 'TYPE', key: 'type', width: 15 },
    { header: 'ARTICLES COMMANDÉS', key: 'items', width: 45 },
    { header: 'MONTANT (FCFA)', key: 'amount', width: 18, style: { numFmt: '#,##0" FCFA"' } },
    { header: 'STATUT', key: 'status', width: 12 },
    { header: 'CODE ACCÈS', key: 'code', width: 15 }
  ];

  // --- EN-TÊTE DESIGN PREMIUM ---
  sheet.mergeCells('A1:L1');
  const mainTitle = sheet.getCell('A1');
  mainTitle.value = 'RAPPORT FINANCIER DÉTAILLÉ - KOBLOGIX PLATFORM';
  mainTitle.font = { name: 'Segoe UI', size: 18, bold: true, color: { argb: 'FFFFFFFF' } };
  mainTitle.alignment = { vertical: 'middle', horizontal: 'center' };
  mainTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0077B6' } };

  sheet.mergeCells('A2:L2');
  const subTitle = sheet.getCell('A2');
  subTitle.value = `Export du ${new Date().toLocaleString('fr-FR')} • Document confidentiel à usage administratif`;
  subTitle.alignment = { horizontal: 'center' };
  subTitle.font = { italic: true, size: 10, color: { argb: 'FF475569' } };

  // --- STATISTIQUES ---
  const approved = transactions.filter(t => t.status === 'approved');
  const totalRev = approved.reduce((acc, t) => acc + t.amount, 0);

  sheet.getCell('A4').value = 'RÉSUMÉ :';
  sheet.getCell('A4').font = { bold: true };
  sheet.getCell('B4').value = `Total Validé : ${totalRev.toLocaleString()} FCFA`;
  sheet.getCell('B4').font = { bold: true, color: { argb: 'FF059669' } };

  // --- STYLE DES EN-TÊTES DE TABLEAU ---
  const headerRow = sheet.getRow(7);
  // Fix: Line 47: Type '(string | string[])[]' is not assignable to type 'CellValue[]'. Ensure we handle possible array headers.
  headerRow.values = (sheet.columns || []).map(c => Array.isArray(c.header) ? c.header.join(' ') : (c.header as string));
  headerRow.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = { 
      top: {style:'thin'}, left: {style:'thin'}, bottom: {style:'medium'}, right: {style:'thin'} 
    };
  });

  // --- INSERTION DES DONNÉES ---
  transactions.forEach((t) => {
    const row = sheet.addRow({
      id: t.id.substring(0, 8),
      date: t.date,
      name: t.name,
      phone: t.phone,
      email: t.email || 'N/A',
      paymentRef: t.paymentRef || 'MANUEL',
      method: t.method.toUpperCase(),
      type: t.type.toUpperCase(),
      items: t.items.map(i => `${i.name} [${formatPrice(i.price)}]`).join(' | '),
      amount: t.amount,
      status: t.status === 'approved' ? 'VALIDÉ' : 'EN ATTENTE',
      code: t.code || '-'
    });

    row.eachCell(cell => {
      cell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
      cell.font = { size: 10 };
      cell.border = { bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } } };
    });

    const statusCell = row.getCell('status');
    if (t.status === 'approved') {
      statusCell.font = { color: { argb: 'FF059669' }, bold: true };
    } else {
      statusCell.font = { color: { argb: 'FFD97706' }, bold: true };
    }
  });

  // --- TÉLÉCHARGEMENT ---
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `KOBLOGIX_EXCEL_PRO_${new Date().toISOString().split('T')[0]}.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const generateReceipt = (transaction: Transaction) => {
  const doc = new jsPDF();
  // Fix: Explicitly type colors as tuples for jspdf-autotable compatibility.
  const primaryColor: [number, number, number] = [0, 119, 182]; // #0077B6
  const secondaryColor: [number, number, number] = [30, 41, 59]; // #1E293B

  // En-tête de couleur
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 40, 'F');

  // Logo K
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(15, 10, 20, 20, 4, 4, 'F');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("K", 21, 25);

  // Titre Société
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text("KOBLOGIX", 45, 20);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Expertise LaTeX & Services Scientifiques", 45, 27);

  // Titre Reçu
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("REÇU DE PAIEMENT", 195, 25, { align: "right" });

  // Informations Transaction
  doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
  doc.setFontSize(10);
  doc.text(`N° Commande : ${transaction.id.substring(0, 12).toUpperCase()}`, 15, 55);
  doc.text(`Date : ${new Date(transaction.date).toLocaleDateString('fr-FR')}`, 15, 60);
  doc.text(`Méthode : ${transaction.method.toUpperCase()} (${transaction.paymentRef || 'Ref N/A'})`, 15, 65);

  // Informations Client
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(120, 45, 75, 25, 3, 3, 'F');
  doc.setFont("helvetica", "bold");
  doc.text("FACTURÉ À :", 125, 52);
  doc.setFont("helvetica", "normal");
  doc.text(transaction.name, 125, 58);
  doc.text(transaction.phone, 125, 63);
  if (transaction.email) doc.text(transaction.email, 125, 68);

  // Tableau des articles
  const tableRows = transaction.items.map(item => [
    item.name, 
    item.details || 'Prestation standard', 
    formatPrice(item.price)
  ]);

  autoTable(doc, {
    startY: 80,
    head: [['Description', 'Détails', 'Montant']],
    body: tableRows,
    theme: 'striped',
    headStyles: { fillColor: primaryColor, textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 5 },
    columnStyles: { 2: { halign: 'right', fontStyle: 'bold' } }
  });

  // Total
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("MONTANT TOTAL PAYÉ :", 120, finalY + 5);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(16);
  doc.text(formatPrice(transaction.amount), 195, finalY + 5, { align: "right" });

  // Footer & Code d'accès
  if (transaction.code) {
    doc.setFillColor(236, 253, 245);
    doc.setDrawColor(5, 150, 105);
    doc.roundedRect(15, finalY + 15, 180, 25, 3, 3, 'FD');
    doc.setTextColor(5, 150, 105);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("VOTRE CODE D'ACCÈS AUX RESSOURCES :", 105, finalY + 23, { align: "center" });
    doc.setFontSize(18);
    doc.text(transaction.code, 105, finalY + 34, { align: "center" });
  }

  doc.setTextColor(150);
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.text("Ce document sert de preuve de paiement. Pour toute assistance, contactez-nous sur WhatsApp au +228 98 28 65 41.", 105, 285, { align: "center" });

  doc.save(`RECU_KOBLOGIX_${transaction.name.replace(/\s/g, '_')}_${transaction.id.substring(0, 4)}.pdf`);
};
