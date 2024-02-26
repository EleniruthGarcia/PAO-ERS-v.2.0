import ExcelJS from "exceljs";

export const addHeader = async (worksheet: ExcelJS.Worksheet, title: string, region: string = "CAR", district: string = "Baguio City", date: string, length: number) => {
    worksheet.mergeCells("A1", `${String.fromCharCode(65 + length - 1)}1`);
    worksheet.getCell("A1").value = 'Republika ng Pilipinas';
    worksheet.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getCell("A1").font = { size: 11 };

    worksheet.mergeCells("A2", `${String.fromCharCode(65 + length - 1)}2`);
    worksheet.getCell("A2").value = 'Kagawaran ng Katarungan';
    worksheet.getCell("A2").alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getCell("A2").font = { size: 11 };

    worksheet.mergeCells("A3", `${String.fromCharCode(65 + length - 1)}3`);
    worksheet.getCell("A3").value = 'TANGGAPAN NG MANANANGGOL PAMBAYAN';
    worksheet.getCell("A3").alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getCell("A3").font = { size: 11 };

    worksheet.mergeCells("A4", `${String.fromCharCode(65 + length - 1)}4`);
    worksheet.getCell("A4").value = '( PUBLIC ATTORNEY\'S OFFICE )';
    worksheet.getCell("A4").alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getCell("A4").font = { bold: true, size: 11, color: { argb: "FF548235" } };

    worksheet.mergeCells("A5", `${String.fromCharCode(65 + length - 1)}5`);
    worksheet.getCell("A5").value = 'Regional Office No: ' + region;
    worksheet.getCell("A5").alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getCell("A5").font = { size: 12, family: 4 };

    worksheet.mergeCells("A6", `${String.fromCharCode(65 + length - 1)}6`);
    worksheet.getCell("A6").value = district + ' District Office';
    worksheet.getCell("A6").alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getCell("A6").font = { size: 12, family: 4 };

    worksheet.mergeCells("A7", `${String.fromCharCode(65 + length - 1)}7`);
    worksheet.getCell("A7").value = title;
    worksheet.getCell("A7").alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getCell("A7").font = { size: 16, family: 4 };

    worksheet.mergeCells("A8", `${String.fromCharCode(65 + length - 1)}8`);
    worksheet.getCell("A8").value = date;
    worksheet.getCell("A8").alignment = { horizontal: "center", vertical: "middle" };
    worksheet.getCell("A8").font = { size: 12, family: 4 };

    worksheet.addRow([]);

    return worksheet;
}