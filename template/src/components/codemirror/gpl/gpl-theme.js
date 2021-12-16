/* eslint-disable */
import CodeMirror from 'codemirror/lib/codemirror'

CodeMirror.defineMode("gpl", function(config, parserConfig) {
  var client = parserConfig.client || {};
  var atoms = parserConfig.atoms || { false: true, true: true, null: true };
  var builtin = parserConfig.builtin || set(defaultBuiltin);
  var keywords = parserConfig.keywords || set(sqlKeywords);
  var operatorChars = parserConfig.operatorChars || /^[*+\-%<>!=&|~^\/]/;
  var support = parserConfig.support || {};
  var hooks = parserConfig.hooks || {};
  var dateSQL = parserConfig.dateSQL || {
    date: true,
    time: true,
    timestamp: true
  };
  var backslashStringEscapes = parserConfig.backslashStringEscapes !== false;
  var brackets = parserConfig.brackets || /^[\{}\(\)\[\]]/;
  var punctuation = parserConfig.punctuation || /^[;.,:]/;
  var func = parserConfig.func || set(functionWords);
  var limit = parserConfig.limit || set(limitWords);
  var orderParam = parserConfig.limit || set(orderParamWords);

  function tokenBase(stream, state) {
    var ch = stream.next();

    // call hooks from the mime type
    if (hooks[ch]) {
      var result = hooks[ch](stream, state);
      if (result !== false) return result;
    }

    if (
      support.hexNumber &&
      ((ch == "0" && stream.match(/^[xX][0-9a-fA-F]+/)) ||
        ((ch == "x" || ch == "X") && stream.match(/^'[0-9a-fA-F]+'/)))
    ) {
      // hex
      // ref: http://dev.mysql.com/doc/refman/5.5/en/hexadecimal-literals.html
      return "number";
    } else if (
      support.binaryNumber &&
      (((ch == "b" || ch == "B") && stream.match(/^'[01]+'/)) ||
        (ch == "0" && stream.match(/^b[01]+/)))
    ) {
      // bitstring
      // ref: http://dev.mysql.com/doc/refman/5.5/en/bit-field-literals.html
      return "number";
    } else if (ch.charCodeAt(0) > 47 && ch.charCodeAt(0) < 58) {
      // numbers
      // ref: http://dev.mysql.com/doc/refman/5.5/en/number-literals.html
      stream.match(/^[0-9]*(\.[0-9]+)?([eE][-+]?[0-9]+)?/);
      support.decimallessFloat && stream.match(/^\.(?!\.)/);
      return "number";
    } else if (
      ch == "?" &&
      (stream.eatSpace() || stream.eol() || stream.eat(";"))
    ) {
      // placeholders
      return "variable-3";
    } else if (ch == "'" || (ch == '"' && support.doubleQuote)) {
      // strings
      // ref: http://dev.mysql.com/doc/refman/5.5/en/string-literals.html
      state.tokenize = tokenLiteral(ch);
      return state.tokenize(stream, state);
    } else if (
      ((support.nCharCast && (ch == "n" || ch == "N")) ||
        (support.charsetCast &&
          ch == "_" &&
          stream.match(/[a-z][a-z0-9]*/i))) &&
      (stream.peek() == "'" || stream.peek() == '"')
    ) {
      // charset casting: _utf8'str', N'str', n'str'
      // ref: http://dev.mysql.com/doc/refman/5.5/en/string-literals.html
      return "keyword";
    } else if (
      support.escapeConstant &&
      (ch == "e" || ch == "E") &&
      (stream.peek() == "'" || (stream.peek() == '"' && support.doubleQuote))
    ) {
      // escape constant: E'str', e'str'
      // ref: https://www.postgresql.org/docs/current/sql-syntax-lexical.html#SQL-SYNTAX-STRINGS-ESCAPE
      state.tokenize = function(stream, state) {
        return (state.tokenize = tokenLiteral(stream.next(), true))(
          stream,
          state
        );
      };
      return "keyword";
    } else if (support.commentSlashSlash && ch == "/" && stream.eat("/")) {
      // 1-line comment
      stream.skipToEnd();
      return "comment";
    } else if (
      (support.commentHash && ch == "#") ||
      (ch == "-" &&
        stream.eat("-") &&
        (!support.commentSpaceRequired || stream.eat(" ")))
    ) {
      // 1-line comments
      // ref: https://kb.askmonty.org/en/comment-syntax/
      stream.skipToEnd();
      return "comment";
    } else if (ch == "/" && stream.eat("*")) {
      // multi-line comments
      // ref: https://kb.askmonty.org/en/comment-syntax/
      state.tokenize = tokenComment(1);
      return state.tokenize(stream, state);
    } else if (ch == ".") {
      // .1 for 0.1
      if (support.zerolessFloat && stream.match(/^(?:\d+(?:e[+-]?\d+)?)/i)) {
        return "number";
      }
      if (stream.match(/^\.+/)) {
        return null;
      }
      // .table_name (ODBC)
      // // ref: http://dev.mysql.com/doc/refman/5.6/en/identifier-qualifiers.html
      if (support.ODBCdotTable && stream.match(/^[\w\d_$#]+/)) {
        return "variable-2";
      }
    } else if (operatorChars.test(ch)) {
      // operators
      stream.eatWhile(operatorChars);
      return "operator";
    } else if (brackets.test(ch)) {
      // brackets
      return "bracket";
    } else if (punctuation.test(ch)) {
      // punctuation
      stream.eatWhile(punctuation);
      return "punctuation";
    } else if (
      ch == "{" &&
      (stream.match(/^( )*(d|D|t|T|ts|TS)( )*'[^']*'( )*}/) ||
        stream.match(/^( )*(d|D|t|T|ts|TS)( )*"[^"]*"( )*}/))
    ) {
      // dates (weird ODBC syntax)
      // ref: http://dev.mysql.com/doc/refman/5.5/en/date-and-time-literals.html
      return "number";
    } else {
      stream.eatWhile(/^[_\w\d]/);
      var word = stream.current().toLowerCase();
      // dates (standard SQL syntax)
      // ref: http://dev.mysql.com/doc/refman/5.5/en/date-and-time-literals.html
      if (
        dateSQL.hasOwnProperty(word) &&
        (stream.match(/^( )+'[^']*'/) || stream.match(/^( )+"[^"]*"/))
      ) {
        return "number";
      }

      if (orderParam.hasOwnProperty(word)) return "order-param";
      if (limit.hasOwnProperty(word)) return "limit";
      if (func.hasOwnProperty(word)) return "func";
      if (atoms.hasOwnProperty(word)) return "atom";
      if (builtin.hasOwnProperty(word)) return "builtin";
      if (keywords.hasOwnProperty(word)) return "keyword";
      if (client.hasOwnProperty(word)) return "string-2";
      return null;
    }
  }

  // 'string', with char specified in quote escaped by '\'
  function tokenLiteral(quote, backslashEscapes) {
    return function(stream, state) {
      var escaped = false;
      var ch;
      while ((ch = stream.next()) != null) {
        if (ch == quote && !escaped) {
          state.tokenize = tokenBase;
          break;
        }
        escaped =
          (backslashStringEscapes || backslashEscapes) &&
          !escaped &&
          ch == "\\";
      }
      return "string";
    };
  }
  function tokenComment(depth) {
    return function(stream, state) {
      var m = stream.match(/^.*?(\/\*|\*\/)/);
      if (!m) stream.skipToEnd();
      else if (m[1] == "/*") state.tokenize = tokenComment(depth + 1);
      else if (depth > 1) state.tokenize = tokenComment(depth - 1);
      else state.tokenize = tokenBase;
      return "comment";
    };
  }

  function pushContext(stream, state, type) {
    state.context = {
      prev: state.context,
      indent: stream.indentation(),
      col: stream.column(),
      type: type
    };
  }

  function popContext(state) {
    state.indent = state.context.indent;
    state.context = state.context.prev;
  }

  return {
    startState: function() {
      return { tokenize: tokenBase, context: null };
    },

    token: function(stream, state) {
      if (stream.sol()) {
        if (state.context && state.context.align == null) {
          state.context.align = false;
        }
      }
      if (state.tokenize == tokenBase && stream.eatSpace()) return null;

      var style = state.tokenize(stream, state);
      if (style == "comment") return style;

      if (state.context && state.context.align == null) {
        state.context.align = true;
      }

      var tok = stream.current();
      if (tok == "(") {
        pushContext(stream, state, ")");
      } else if (tok == "[") {
        pushContext(stream, state, "]");
      } else if (state.context && state.context.type == tok) {
        popContext(state);
      }
      return style;
    },

    indent: function(state, textAfter) {
      var cx = state.context;
      if (!cx) return CodeMirror.Pass;
      var closing = textAfter.charAt(0) == cx.type;
      if (cx.align) return cx.col + (closing ? 0 : 1);
      else return cx.indent + (closing ? 0 : config.indentUnit);
    },

    blockCommentStart: "/*",
    blockCommentEnd: "*/",
    lineComment: support.commentSlashSlash
      ? "//"
      : support.commentHash
      ? "#"
      : "--",
    closeBrackets: "()[]{}''\"\"``"
  };
});

// these keywords are used by all SQL dialects (however, a mode can still overwrite it)
var sqlKeywords =
  "alter and as asc between by count create delete desc distinct drop from group having in insert into is join like not on or order select set table union update values where limit "
+ 
"dbxquery eval fields filter fpGrowth fpGrowthFit iForest inputcsv join kmeans lookup ma orderBy outputcsv outputdb print python quartile rareM rename results script show sigma3 sort sql stats table top union unionAll unionByName var where "

// turn a space-separated list into an array
function set(str) {
  var obj = {};
  var words = str.split(" ");
  for (var i = 0; i < words.length; ++i) obj[words[i].toLowerCase()] = true;
  return obj;
}

var functionWords = "dga abs acoc add_mouths array_contains array_distinct array_except array_intersect array_join array_max array_min array_position array_remove array_repeat array_repeat array_sort array_union array arrays_overlap arrays_zip ascii asin atan atan2 base64 bin bround bround cbrt ceil coalesce concat_ws concat conv cos cosh cume_dist current_date current_timestamp date_add date_format date_sub datediff dayofmonth dayofweek dayofyear decode degrees dense_rank element_at encode exp explode_outer explode expm1 expr factorial flatten format_number format_string from_unixtime from_utc_timestamp floor get_json_Column greatest hash hex hour hypot initcap instr isnan isnull last_day lead least least length levenshtein locate log log10 log1p log2 lower lpad ltrim ltrim map_concat map_from_arrays map_keys map_values map md5 minute month months_between nanvl negate next_day not ntile pmod posexplode_outer posexplode pow quarter radians rank regexp_extract regexp_replace repeat reverse rint round row_number rtrim second sequence slice shuffle signum sin sinh size sort_array split substring_index substring tan tanh to_date to_json to_timestamp to_timestamp translate trim trunc date_trunc unbase64 unhex unix_timestamp upper weekofyear year collect_list collect_set first last avg mean max min sum count covar_pop covar_samp kurtosis skewness stddev_pop stddev_samp stddev var_pop var_samp variance approx_count_distinct"

var defaultBuiltin =
  "bool boolean bit blob enum long longblob longtext medium mediumblob mediumint mediumtext time timestamp tinyblob tinyint tinytext text bigint int int1 int2 int3 int4 int8 integer float float4 float8 double char varbinary varchar varcharacter precision real date datetime year unsigned signed decimal numeric";

var limitWords = "limit"

var orderParamWords = "as by or and"


// A generic SQL Mode. It's not a standard, it just try to support what is generally supported
CodeMirror.defineMIME("text/x-gpl", {
  name: "gpl",
  keywords: set(sqlKeywords + "begin "),
  builtin: set(defaultBuiltin),
  atoms: set("false true null unknown"),
  dateSQL: set("date time timestamp"),
  support: set("ODBCdotTable doubleQuote binaryNumber hexNumber"),
  func: set(functionWords),
  limit: set(limitWords),
  orderParam: set(orderParamWords)
});
