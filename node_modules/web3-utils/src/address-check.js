// var base58 = require('base58-native');

// export function toAddress(address) {
//   address = address.substring(6, address.length);
//   return '0x' + base58.decode(address).toString();
// }

// export function toVaddress(address) {
//   var lowerAddress = address.toLowerCase();
//   return (
//     '142857' +
//     base58.encode(new Buffer(lowerAddress.substring(2).toLowerCase()))
//   );
// }

// var base58 = require('base58-native');
var ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
var ALPHABET_MAP = {};
var BASE = 58;
for (var i = 0; i < ALPHABET.length; i++) {
  ALPHABET_MAP[ALPHABET.charAt(i)] = i;
}

module.exports = {
  toAddress: function (address) {
    address = address.substring(6, address.length);
    var s = decode(address);
    var str = byteToString(s);
    return '0x' + str;
  },
  toVaddress: function (address) {
    var lowerAddress = address.toLowerCase();
    return '142857' + encode(ToUTF8(lowerAddress.substring(2).toLowerCase()));
  },
};

// 字符串转utf8格式的字节数组（英文和数字直接返回的acsii码，中文转%xx之后打断当成16进制转10进制）
function ToUTF8(str) {
  var result = new Array();

  var k = 0;
  for (var i = 0; i < str.length; i++) {
    var j = encodeURI(str[i]);
    if (j.length == 1) {
      // 未转换的字符
      result[k++] = j.charCodeAt(0);
    } else {
      // 转换成%XX形式的字符
      var bytes = j.split('%');
      for (var l = 1; l < bytes.length; l++) {
        result[k++] = parseInt('0x' + bytes[l]);
      }
    }
  }

  return result;
}

// 如果有特殊需求，要转成utf16，可以用以下函数
function ToUTF16(str) {
  var result = new Array();

  var k = 0;
  for (var i = 0; i < str.length; i++) {
    var j = str[i].charCodeAt(0);
    result[k++] = j & 0xff;
    result[k++] = j >> 8;
  }

  return result;
}

// 传进已经转成字节的数组 -->buffer(utf8格式)
function encode(buffer) {
  if (buffer.length === 0) return '';
  var i,
    j,
    digits = [0];
  for (i = 0; i < buffer.length; i++) {
    for (j = 0; j < digits.length; j++) {
      // 将数据转为二进制，再位运算右边添8个0，得到的数转二进制
      // 位运算-->相当于 digits[j].toString(2);parseInt(10011100000000,2)
      digits[j] <<= 8;
    }
    digits[0] += buffer[i];
    var carry = 0;
    for (j = 0; j < digits.length; ++j) {
      digits[j] += carry;
      carry = (digits[j] / BASE) | 0;
      digits[j] %= BASE;
    }
    while (carry) {
      digits.push(carry % BASE);
      carry = (carry / BASE) | 0;
    }
  }
  // deal with leading zeros
  for (i = 0; buffer[i] === 0 && i < buffer.length - 1; i++) digits.push(0);
  return digits
    .reverse()
    .map(function (digit) {
      return ALPHABET[digit];
    })
    .join('');
}

// string ---> 加密后的字符串
function decode(string) {
  if (string.length === 0) return [];
  var i,
    j,
    bytes = [0];
  for (i = 0; i < string.length; i++) {
    var c = string[i];
    // c是不是ALPHABET_MAP的key
    if (!(c in ALPHABET_MAP)) throw new Error('Non-base58 character');
    for (j = 0; j < bytes.length; j++) bytes[j] *= BASE;
    bytes[0] += ALPHABET_MAP[c];
    var carry = 0;
    for (j = 0; j < bytes.length; ++j) {
      bytes[j] += carry;
      carry = bytes[j] >> 8;
      // 0xff --> 11111111
      bytes[j] &= 0xff;
    }
    while (carry) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }
  // deal with leading zeros
  for (i = 0; string[i] === '1' && i < string.length - 1; i++) bytes.push(0);
  return bytes.reverse();
}

//字节序列转ASCII码
//[0x24, 0x26, 0x28, 0x2A] ==> "$&C*"
function byteToString(arr) {
  if(typeof arr === 'string') {
      return arr;
  }
  var str = '',
      _arr = arr;
  for(var i = 0; i < _arr.length; i++) {
      var one = _arr[i].toString(2),
          v = one.match(/^1+?(?=0)/);
      if(v && one.length == 8) {
          var bytesLength = v[0].length;
          var store = _arr[i].toString(2).slice(7 - bytesLength);
          for(var st = 1; st < bytesLength; st++) {
              store += _arr[st + i].toString(2).slice(2);
          }
          str += String.fromCharCode(parseInt(store, 2));
          i += bytesLength - 1;
      } else {
          str += String.fromCharCode(_arr[i]);
      }
  }
  return str;
}
