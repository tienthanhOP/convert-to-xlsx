import {
  ADDRESS_TEXT,
  BUYING_TEXT,
  PHONE_NUMBER_TEXT,
  RECEIVER_TEXT,
  SHIP,
} from "./constants";

export const convertTextToObject = (order) => {
  const result = {};
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
  result.freeship = order.includes(SHIP) ? "Bên vận chuyển thu" : "Freeship";
  const equalSign = "=";
  const kCharacter = "k";
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

  return result;
};

const isNumeric = (n) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};
