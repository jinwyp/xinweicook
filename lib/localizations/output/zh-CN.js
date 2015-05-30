;(function() {
  var timezones = {"Asia/Shanghai":{"types":["s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","s"],"untils":[515519999000,515520000000,527007599000,527007600000,545155199000,545155200000,558457199000,558457200000,576604799000,576604800000,589906799000,589906800000,608659199000,608659200000,621961199000,621961200000,640108799000,640108800000,653410799000,653410800000,671558399000,671558400000,684860399000,684860400000,2147397247000,2147483647000],"offsets":[-480,-540,-540,-480,-480,-540,-540,-480,-480,-540,-540,-480,-480,-540,-540,-480,-480,-540,-540,-480,-480,-540,-540,-480,-480,-480]}};

  function getTimezoneOffset(timezoneOffset, options) {
    options = options || {};
    options.hours = typeof options.hours !== 'undefined' ? options.hours : true;
    options.zeroPaddingHours = typeof options.zeroPaddingHours !== 'undefined' ? options.zeroPaddingHours : true;
    options.minutes = typeof options.minutes !== 'undefined' ? options.minutes : true;
    options.colon = typeof options.colon !== 'undefined' ? options.colon : true;
    options.zulu = typeof options.zulu !== 'undefined' ? options.zulu : false;

    var offsetFloatingHours = timezoneOffset / 60;
    var offsetHours;
    var offsetMinutes;

    if(timezoneOffset >= 0) {
      offsetHours = Math.floor(offsetFloatingHours);
      offsetMinutes = ((offsetFloatingHours % 1) * 60).toFixed(0);
    }
    else {
      offsetHours = Math.ceil(offsetFloatingHours);
      offsetMinutes = - ((offsetFloatingHours % 1) * 60).toFixed(0);
    }
    if(offsetMinutes < 10) {
      offsetMinutes = '0' + offsetMinutes;
    }

    if(options.zulu && offsetHours === 0) {
      return 'Z';
    }

    var result = '';
    if(options.zeroPaddingHours) {
      if(offsetHours > -10 && offsetHours < 0) {
        offsetHours = (offsetHours + '').replace('-', '-0');
      }
      else if(offsetHours >= 0 && offsetHours < 10) {
        offsetHours = '0' + offsetHours;
      }
    }
    if(options.hours) {
      if((offsetHours + '').charAt(0) !== '-') {
        offsetHours = '+' + offsetHours;
      }
      result += offsetHours;
    }
    if(options.colon) {
      result += ':';
    }
    if(options.minutes) {
      result += offsetMinutes;
    }

    return result;
  }

  function getLongLocalizedGMT(GMTFormat, timezoneOffset) {
    return GMTFormat.replace('{0}', getTimezoneOffset(timezoneOffset));
  }

  function roundTo(number, to) {
    return Math.round(number / to) * to;
  }

  function toSignficantDigits(number, minimumSignificantDigits, maximumSignificantDigits) {
    var multiple = Math.pow(10, maximumSignificantDigits - Math.floor(Math.log(number) / Math.LN10) - 1);
    number = Math.round(number * multiple) / multiple + '';
    var difference = maximumSignificantDigits - minimumSignificantDigits;
    if(difference > 0 && /\./.test(difference)) {
      number = number.replace(new RegExp('0{1,' + difference + '}$'), '');
    }
    var subtract = 0;
    if(/^0\./.test(number)) {
      subtract = 2;
    }
    else if(/\./.test(number)) {
      subtract = 1;
    }
    while(number.length - subtract < minimumSignificantDigits) {
      number += '0';
    }

    return number;
  }

  function toExponentDigits(number, it) {
    var minimumMantissaIntegerDigits = 1
      , maximumMantissaIntegerDigits = Infinity
      , exponentGrouping = 1
      , minimumMantissaSignificantDigits
      , maximumMantissaSignificantDigits
      , exponentNumber = 0;

    if(it.type === 'floating') {
      if(it.maximumIntegerDigits === it.minimumIntegerDigits) {
        minimumMantissaIntegerDigits = maximumMantissaIntegerDigits = it.minimumIntegerDigits;
      }
      else {
        maximumMantissaIntegerDigits = it.maximumIntegerDigits;
        exponentGrouping = it.maximumIntegerDigits;
      }

      minimumMantissaSignificantDigits = 1;
      maximumMantissaSignificantDigits = it.minimumIntegerDigits + it.maximumFractionDigits;
    }
    else {
      minimumMantissaIntegerDigits = maximumMantissaIntegerDigits = 1;
      minimumMantissaSignificantDigits = it.minimumSignificantDigits;
      maximumMantissaSignificantDigits = it.maximumSignificantDigits
    }

    if(number >= 1) {
      var divider = Math.pow(10, exponentGrouping)
        , integerLength = (number + '').replace(/\.\d+/, '').length;
      while((integerLength < minimumMantissaIntegerDigits || integerLength > maximumMantissaIntegerDigits) &&
            (exponentNumber + '').length === it.exponent.digits) {
        number = number / divider;
        exponentNumber += exponentGrouping;
        integerLength = (number + '').replace(/\.\d+/, '').length;
      }
      if((exponentNumber + '').length !== it.exponent.digits) {
        exponentNumber--;
        number = number * divider;
      }
    }
    else {
      var multiplier = Math.pow(10, exponentGrouping)
        , integerLength = (number + '').replace(/^0\.\d+/, '').replace(/\.\d+/, '').length;
      while((integerLength < minimumMantissaIntegerDigits || integerLength > maximumMantissaIntegerDigits) &&
            (Math.abs(exponentNumber) + '').length === it.exponent.digits) {
        number = number * multiplier;
        exponentNumber -= exponentGrouping;
        integerLength = (number + '').replace(/^0\.\d+/, '').replace(/\.\d+/, '').length;
      }
      if((Math.abs(exponentNumber) + '').length !== it.exponent.digits) {
        exponentNumber++;
        number = number / multiplier;
      }
    }

    var mantissa = toSignficantDigits(number, minimumMantissaSignificantDigits, maximumMantissaSignificantDigits)
      , mantissa = mantissa.split('.')
      , exponent = it.symbols.exponential;
    if(it.exponent.plusSign && exponentNumber > 0) {
      exponent += it.symbols.plusSign;
    }
    exponent += exponentNumber;

    if(it.type === 'floating') {
      if(it.minimumFractionDigits > 0) {
        if(typeof mantissa[1] === 'undefined') {
          mantissa[1] = '';
        }
        while(mantissa[1].length < it.minimumFractionDigits) {
          mantissa[1] += '0';
        }
      }
    }

    return {
      integer: mantissa[0],
      fraction: mantissa[1],
      exponent: exponent
    };
  };

  function formatNumber(it) {
    if(typeof it.number !== 'number') {
      return it.symbols.nan;
    }
    if(it.number === Infinity) {
      return it.symbols.plusSign + it.symbols.infinity;
    }
    if(it.number === -Infinity) {
      return it.symbols.minusSign + it.symbols.infinity;
    }

    var number = Math.abs(it.number)
      , prefix = it.prefix
      , suffix = it.suffix
      , currencySymbol =
        '([\\u0024\\u00A2-\\u00A5\\u058F\\u060B\\u09F2\\u09F3\\u09FB\\u0AF1\\\
           \\u0BF9\\u0E3F\\u17DB\\u20A0-\\u20BD\\uA838\\uFDFC\\uFE69\\uFF04\\\
           \\uFFE0\\uFFE1\\uFFE5\\uFFE6])'
      , startsWithCurrencySymbolSyntax = new RegExp('^' + currencySymbol)
      , endsWithCurrencySymbolSyntax = new RegExp(currencySymbol + '$');

    if(it.percentage) {
      prefix = prefix.replace('%', it.symbols.percentSign);
      suffix = suffix.replace('%', it.symbols.percentSign);
      number = number * 100;
    }
    else if(it.permille) {
      prefix = prefix.replace('‰', it.symbols.perMille);
      suffix = suffix.replace('‰', it.symbols.perMille);
      number = number * 1000;
    }

    if(it.exponent) {
      var exponent = toExponentDigits(number, it);
      integerDigits = exponent.integer;
      fractionDigits = exponent.fraction || '';
      exponent = exponent.exponent;
    }
    else if(it.type === 'significant') {
      number = toSignficantDigits(number, it.minimumSignificantDigits, it.maximumSignificantDigits);
    }
    else {
      number = roundTo(number, it.roundTo);
    }

    if(!it.exponent) {
      var numberSplit = (number + '').split('.')
        , integerDigits = numberSplit[0]
        , integerDigitsLength = integerDigits.length
        , fractionDigits = numberSplit[1] || ''
        , fractionDigitsLength = fractionDigits.length;

      if(it.type === 'floating' && integerDigitsLength < it.minimumIntegerDigits) {
        var missingIntegerDigits = it.minimumIntegerDigits - integerDigitsLength;
        for(var index = 0; index < missingIntegerDigits; index++) {
          integerDigits = '0' + integerDigits;
        }
        integerDigitsLength = it.minimumIntegerDigits;
      }
      if(it.groupSize) {
        var newIntegerDigits = '';
        for(var index = integerDigitsLength - 1; index >= 0; index--) {
          var primaryIndex = integerDigitsLength - it.groupSize.primary - 1;
          if(index === primaryIndex) {
            newIntegerDigits += it.symbols.group;
          }
          else if(index < primaryIndex && (primaryIndex - index) % it.groupSize.secondary === 0) {
            newIntegerDigits += it.symbols.group;
          }

          newIntegerDigits += integerDigits.charAt(index);
        }
        integerDigits = newIntegerDigits.split('').reverse().join('');
      }

      if(it.type === 'floating') {
        if(fractionDigitsLength > it.maximumFractionDigits) {
          fractionDigits = fractionDigits.substring(0, it.maximumFractionDigits);
        }
        else if(fractionDigitsLength < it.minimumFractionDigits) {
          var missingFractionDigits = it.minimumFractionDigits - fractionDigitsLength;
          for(var index = 0; index < missingFractionDigits; index++) {
            fractionDigits += '0';
          }
        }

        if(fractionDigits.length > it.minimumFractionDigits) {
          fractionDigits = fractionDigits.replace(/[0]+$/, '');
        }
      }
    }

    if(it.currency) {
      if(!endsWithCurrencySymbolSyntax.test(it.currency.symbol)) {
        prefix = prefix + ' ';
      }
      if(!startsWithCurrencySymbolSyntax.test(it.currency.symbol)) {
        suffix = ' ' + suffix;
      }
      prefix = prefix.replace(/¤+/, it.currency.symbol);
      suffix = suffix.replace(/¤+/, it.currency.symbol);
    }

    var result = '';
    result += prefix;
    result += integerDigits;
    if(fractionDigits.length > 0) {
      result += it.symbols.decimal + fractionDigits;
    }
    if(exponent) {
      result += exponent;
    }
    result += suffix;

    if(it.paddingCharacter) {
      var resultLength = result.length - 2;
      result = result.replace(new RegExp('\\*\\' + it.paddingCharacter), function(match) {
        var replacement = '';
        while(resultLength < it.patternLength) {
          replacement += it.paddingCharacter;
          resultLength++;
        }

        return replacement;
      });
    }

    return result;
  }

  var localizations = {
    'zh-CN': {
      '__getPluralKeyword': function(cardinal) {
        return 'other';
      },
      '__getOrdinalKeyword': function(cardinal) {
        return 'other';
      },
      '__numberSymbols': {
        'hanidec': {
          'decimal': '.',
          'group': ',',
          'list': ';',
          'percentSign': '%',
          'plusSign': '+',
          'minusSign': '-',
          'exponential': 'E',
          'superscriptingExponent': '×',
          'perMille': '‰',
          'infinity': '∞',
          'nan': 'NaN',
          'timeSeparator': ':'
        },
        'latn': {
          'decimal': '.',
          'group': ',',
          'list': ';',
          'percentSign': '%',
          'plusSign': '+',
          'minusSign': '-',
          'exponential': 'E',
          'superscriptingExponent': '×',
          'perMille': '‰',
          'infinity': '∞',
          'nan': 'NaN',
          'timeSeparator': ':'
        }
      },
      '__currencies': {
        'CNY': {
          'name': '人民币',
          'text': {
            'local': {
              'other': '元'
            },
            'global': {
              'other': '人民币'
            }
          },
          'symbol': {
            'local': '¥',
            'global': 'CN¥',
            'reverseGlobal': '¥CN'
          }
        }
      },
      '__currencyUnitPattern': {
        'other': '{0}{1}'
      },
      '__timezones': {
        'Asia/Shanghai': {
          'name': {
            'long': {
              'standard': '中国标准时间',
              'daylight': '中国夏令时间',
              'generic': '中国时间'
            },
            'short': {
              'standard': null,
              'daylight': null,
              'generic': null
            }
          },
          'hasCity': true,
          'city': '上海',
          'regionFormat': '{0}时间',
          'GMTFormat': 'GMT{0}'
        }
      },
      'ErrNotFound': function(it) {
        var string = '';
        string += '找不到资源';
        return string;
      }
    }
  };

  function l(key) {
    if(!(key in localizations['zh-CN'])) {
      throw new TypeError('Key `' + key + '` not in zh-CN localizations');
    }
    return localizations['zh-CN'][key].call(localizations['zh-CN'], arguments[1]);
  }

  if(typeof require === "function" && typeof exports === 'object' && typeof module === 'object') {
    module.exports = l;
  }
  else if (typeof define === "function" && define.amd) {
    define(function() {
      return l;
    });
  }
  else {
    window.l = l;
  }
})();
