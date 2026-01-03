
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

  sheet.mergeCells('A1:L1');
  const mainTitle = sheet.getCell('A1');
  mainTitle.value = 'RAPPORT FINANCIER DÉTAILLÉ - KOBLOGIX PLATFORM';
  mainTitle.font = { name: 'Segoe UI', size: 18, bold: true, color: { argb: 'FFFFFFFF' } };
  mainTitle.alignment = { vertical: 'middle', horizontal: 'center' };
  mainTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0077B6' } };

  sheet.mergeCells('A2:L2');
  const subTitle = sheet.getCell('A2');
  subTitle.value = `Export du ${new Date().toLocaleString('fr-FR')} • Document confidentiel`;
  subTitle.alignment = { horizontal: 'center' };
  subTitle.font = { italic: true, size: 10, color: { argb: 'FF475569' } };

  const approved = transactions.filter(t => t.status === 'approved');
  const totalRev = approved.reduce((acc, t) => acc + t.amount, 0);

  sheet.getCell('A4').value = 'RÉSUMÉ :';
  sheet.getCell('B4').value = `Total Validé : ${totalRev.toLocaleString()} FCFA`;

  const headerRow = sheet.getRow(7);
  headerRow.values = (sheet.columns || []).map(c => Array.isArray(c.header) ? c.header.join(' ') : (c.header as string));
  headerRow.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.alignment = { horizontal: 'center' };
  });

  transactions.forEach((t) => {
    sheet.addRow({
      id: t.id.substring(0, 8),
      date: t.date,
      name: t.name,
      phone: t.phone,
      email: t.email || 'N/A',
      paymentRef: t.paymentRef || 'MANUEL',
      method: t.method.toUpperCase(),
      type: t.type.toUpperCase(),
      items: t.items.map(i => `${i.name}`).join(', '),
      amount: t.amount,
      status: t.status === 'approved' ? 'VALIDÉ' : 'EN ATTENTE',
      code: t.code || '-'
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `KOBLOGIX_EXCEL_${new Date().toISOString().split('T')[0]}.xlsx`;
  a.click();
};

export const generateReceipt = (transaction: Transaction) => {
  const doc = new jsPDF();
  const primaryColor: [number, number, number] = [0, 119, 182];

  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 40, 'F');

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(15, 10, 20, 20, 4, 4, 'F');
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(22);
  doc.text("K", 21, 25);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text("KOBLOGIX", 45, 20);

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.text(`N° Commande : ${transaction.id.toUpperCase()}`, 15, 55);
  doc.text(`Date : ${new Date(transaction.date).toLocaleDateString()}`, 15, 60);

  const tableRows = transaction.items.map(item => [item.name, formatPrice(item.price)]);
  autoTable(doc, {
    startY: 80,
    head: [['Description', 'Montant']],
    body: tableRows,
    headStyles: { fillColor: primaryColor }
  });

  doc.save(`RECU_KOBLOGIX_${transaction.id.substring(0, 6)}.pdf`);
};
