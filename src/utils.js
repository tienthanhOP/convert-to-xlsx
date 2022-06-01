import { saveAs } from "file-saver";
import XLSX from 'xlsx-populate/browser/xlsx-populate';
import {
  ADDRESS_TEXT,
  BUYING_TEXT,
  PAID,
  PHONE_NUMBER_TEXT,
  RECEIVER_TEXT,
  SHIP,
} from "./constants";

export const convertTextToObject = (order) => {
  const result = {};
  result.id = uuidV4();
  result.receiver = order
    .substring(
      order.indexOf(RECEIVER_TEXT) + RECEIVER_TEXT.length,
      order.indexOf(ADDRESS_TEXT)
    )
    .trim();
  result.address = order
    .substring(
      order.indexOf(ADDRESS_TEXT) + ADDRESS_TEXT.length,
      order.indexOf(PHONE_NUMBER_TEXT)
    )
    .trim();
  result.phone = order
    .substring(
      order.indexOf(PHONE_NUMBER_TEXT) + PHONE_NUMBER_TEXT.length,
      order.indexOf(BUYING_TEXT)
    )
    .trim();
  result.buying = order
    .substring(
      order.indexOf(BUYING_TEXT) + BUYING_TEXT.length,
      order.indexOf(SHIP)
    )
    .trim();
  const kCharacter = "k";
  const equalSign = "=";
  if (result.buying.includes(equalSign)) {
    const txtAfterEqualSign = result.buying.substring(
      result.buying.indexOf(equalSign) + equalSign.length,
      result.buying.length
    );
    result.price = txtAfterEqualSign
      .substring(0, txtAfterEqualSign.indexOf(kCharacter))
      .trim();
  } else {
    const listTmp = result.buying.split(" ");
    for (let i = listTmp.length - 1; i > 0; i--) {
      const element = listTmp[i];
      if (element.includes(kCharacter)) {
        const price = element.substring(0, element.indexOf(kCharacter)).trim();
        if (isNumeric(price)) {
          result.price = price;
          continue;
        }
      }
    }
  }
  const paid = order.includes(PAID);
  if (paid) {
    const txtAfterPaid = order.substring(
      order.indexOf(PAID) + PAID.length,
      order.length
    );
    let paidNumber = txtAfterPaid
      .substring(0, txtAfterPaid.indexOf(kCharacter))
      .trim();
    if (isNumeric(paidNumber)) {
      const tmp = parseInt(paidNumber) - parseInt(result.price);
      const isFreeship = !order.includes(SHIP);
      if (tmp >= 30) {
        result.freeship = `đã ck ${paidNumber} cả ship`;
      } else if (tmp < 0) {
        result.freeship = `đã ck ${paidNumber} còn ${-tmp}k + ${isFreeship ? 'freeship' : 'phí ship người nhận trả'}`;
      } else {
        result.freeship = `đã ck ${paidNumber} + ${isFreeship ? 'freeship' : 'phí ship người nhận trả'}`;
      }
    }
  } else {
    result.freeship = order.includes(SHIP) ? "Shipcod + phí ship người nhận trả" : "Shipcod + freeship";
  }

  return result;
};

const isNumeric = (n) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

export const uuidV4 = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

const getSheetData = (data, header) => {
  var fields = Object.keys(data[0]);
  var sheetData = data.map(function (row) {
    return fields.map(function (fieldName) {
      return row[fieldName] ? row[fieldName] : "";
    });
  });
  sheetData.unshift(header);
  return sheetData;
}

export const downloadXLSX = async (orders) => {
  let header = [
    "STT",
    "MÃ VẬN ĐƠN",
    "HỌ VÀ TÊN",
    "ĐỊA CHỈ",
    "TỈNH ĐẾN",
    "SĐT", "GH",
    "SL",
    "CHI TIẾT",
    "NO",
    "KL",
    "TẶNG",
    "TIỀN",
    "PHÍ SHIP",
    "NGÀY",
    "NOTE",
    "NGƯỜI LÊN ĐƠN",
    "NGƯỜI CHỐT"
  ];

  XLSX.fromBlankAsync().then(async (workbook) => {
    const sheet1 = workbook.sheet(0);
    const sheetData = getSheetData(orders, header);
    const totalColumns = sheetData[0].length;

    sheet1.cell("A1").value(sheetData);
    const range = sheet1.usedRange();
    const endColumn = String.fromCharCode(64 + totalColumns);
    sheet1.row(1).style("bold", true);
    sheet1.range("A1:" + endColumn + "1").style("fill", "FFFF00");
    range.style("border", true);
    return workbook.outputAsync().then((res) => {
      saveAs(res, "file.xlsx");
    });
  });
}
