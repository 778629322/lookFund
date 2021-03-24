/**
 * 工具函数
 */
function returnFloat(value) {
  value = Math.round(parseFloat(value) * 100) / 100;
  if (String(value).indexOf(".") == -1) return value;
  const xsd = value.toString().split(".");
  if (xsd.length == 1) {
    value = value.toString() + ".00";
    return value;
  }
  if (xsd.length > 1) {
    if (xsd[1].length < 2) {
      value = value.toString() + "0";
    }
    return value;
  }
}
export const numberFormat = function(value) {
  if (!value) return "0";
  var param = {
    percent: value < 0 ? "-" : "",
    value: "",
    unit: "",
  };
  value = String(value).replace(/-/g, "");
  var k = 10000,
    sizes = ["", "万", "亿", "万亿"],
    i;

  if (value < k) {
    param.value = returnFloat(value);
  } else {
    i = Math.floor(Math.log(value) / Math.log(k));
    param.value = returnFloat(value / Math.pow(k, i));
    param.unit = sizes[i];
  }
  return `${param.percent + param.value + param.unit}`;
};
