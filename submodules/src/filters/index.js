//千分位展示--s为1000，n为2时，1000变成 1,000.00，小数点后全是0则删除
export function formatMoney(s, n) { // s代表金额，n表示小数点后位,金额每3位用逗号隔开，小数点后保留n位，
  if (s == null || s == undefined) {
      return '-'
  }
  //不是不是数字，直接把原数据返回
  if (!Number(s)) {
      return s
  }
  //记录s正负
  let symbol = ''
  if (s < 0) {
      symbol = '-';
      s = Math.abs(s)
  }
  n = n > 0 && n <= 20 ? n : 2;
  s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
  var l = s.split(".")[0].split("").reverse(), r = s.split(".")[1] || "";
  // 小数点后全为0则不展示
  let str = ''
  for (let i = 0; i < n; i++) {
      str = str + '0'
  }
  if (r !== str) {
      r = r ? ("." + r) : r
  } else {
      r = ''
  }
  //除去r尾数0
  r = r.replace(/\.?0+$/, "")
  let t = '';
  for (let i = 0; i < l.length; i++) {
      t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
  }
  return symbol + t.split("").reverse().join("") + r;
}
//s为10000 10000变成 1.00万
export function formatUnit(s) { // s代表金额,金额每3位用逗号隔开
    if (s) {
        let num = s
        if (typeof s == "string") {
            num = Number(s.replace(/,/g, ""))
        }
        if (num) {
            if (num > 100000000) {
                return String(Math.round(num / 1000000) / 100).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') + '<span class="lableName">亿</span>'
            } else if (num > 10000) {
                return String(Math.round(num / 100) / 100).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') + '<span class="lableName">万</span>'
            } else {
                return String(Math.round(num * 100) / 100).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
            }
        } else {
            return "0"
        }
    } else {
        return "0"
    }
}

