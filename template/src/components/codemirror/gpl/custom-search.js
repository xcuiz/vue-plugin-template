/* eslint-disable */
import CodeMirror from 'codemirror/lib/codemirror'

function searchOverlay(query, caseInsensitive) {
  if (typeof query == "string")
    query = new RegExp(
      query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"),
      caseInsensitive ? "gi" : "g"
    );
  else if (!query.global)
    query = new RegExp(query.source, query.ignoreCase ? "gi" : "g");

  return {
    token: function(stream) {
      query.lastIndex = stream.pos;
      var match = query.exec(stream.string);
      if (match && match.index == stream.pos) {
        stream.pos += match[0].length || 1;
        return "searching";
      } else if (match) {
        stream.pos = match.index;
      } else {
        stream.skipToEnd();
      }
    }
  };
}

function SearchState() {
  this.posFrom = this.posTo = this.lastQuery = this.query = null;
  this.overlay = null;
}

function getSearchState(cm) {
  return cm.state.search || (cm.state.search = new SearchState());
}

function queryCaseInsensitive(query) {
  return typeof query == "string" && query == query.toLowerCase();
}

function getSearchCursor(cm, query, pos) {
  // Heuristic: if the query string is all lowercase, do a case insensitive search.
  return cm.getSearchCursor(query, pos, {
    caseFold: queryCaseInsensitive(query),
    multiline: true
  });
}

function persistentDialog(cm, text, deflt, onEnter, onKeyDown) {
  cm.openCustomDialog(text, onEnter, {
    value: deflt,
    selectValueOnOpen: true,
    closeOnEnter: false,
    onClose: function() {
      clearSearch(cm);
    },
    onKeyDown: onKeyDown,
    className: 'custom-dialog'
  });
}

let closer = null
function dialog(cm, text, shortText, deflt, f) {
  if (cm.openCustomDialog) {
    closer = cm.openCustomDialog(text, f, { value: deflt, selectValueOnOpen: true, className: 'custom-dialog' });
  }
  else f(prompt(shortText, deflt));
}

function confirmDialog(cm, text, shortText, fs) {
  if (cm.openCustomConfirm) cm.openCustomConfirm(text, fs);
  else if (confirm(shortText)) fs[0]();
}

function parseString(string) {
  return string.replace(/\\([nrt\\])/g, function(match, ch) {
    if (ch == "n") return "\n";
    if (ch == "r") return "\r";
    if (ch == "t") return "\t";
    if (ch == "\\") return "\\";
    return match;
  });
}

function parseQuery(query) {
  var isRE = query.match(/^\/(.*)\/([a-z]*)$/);
  if (isRE) {
    try {
      query = new RegExp(isRE[1], isRE[2].indexOf("i") == -1 ? "" : "i");
    } catch (e) {
      //
    } // Not a regular expression after all, do a string search
  } else {
    query = parseString(query);
  }
  if (typeof query == "string" ? query == "" : query.test("")) query = /x^/;
  return query;
}

function startSearch(cm, state, query) {
  state.queryText = query;
  state.query = parseQuery(query);
  cm.removeOverlay(state.overlay, queryCaseInsensitive(state.query));
  state.overlay = searchOverlay(state.query, queryCaseInsensitive(state.query));
  cm.addOverlay(state.overlay);
  if (cm.showMatchesOnScrollbar) {
    if (state.annotate) {
      state.annotate.clear();
      state.annotate = null;
    }
    state.annotate = cm.showMatchesOnScrollbar(
      state.query,
      queryCaseInsensitive(state.query)
    );
  }
}

function doSearch(cm, rev, persistent, immediate, isReplace) {
  closeAndClear(cm)

  var state = getSearchState(cm);
  if (state.query) return findNext(cm, rev);
  var q = cm.getSelection() || state.lastQuery;
  if (q instanceof RegExp && q.source == "x^") q = null;
  if (persistent && cm.openCustomDialog) {
    var hiding = null;
    var searchNext = function(query, event) {
      CodeMirror.e_stop(event);
      if (!query) return;
      if (query != state.queryText) {
        startSearch(cm, state, query);
        state.posFrom = state.posTo = cm.getCursor();
      }
      if (hiding) hiding.style.opacity = 1;
      findNext(cm, event.shiftKey, function(_, to) {
        var dialog;
        if (
          to.line < 3 &&
          document.querySelector &&
          (dialog = cm.display.wrapper.querySelector(".CodeMirror-dialog")) &&
          dialog.getBoundingClientRect().bottom - 4 >
            cm.cursorCoords(to, "window").top
        )
          (hiding = dialog).style.opacity = 0.4;
      });
    };
    persistentDialog(cm, getQueryDialog(cm, isReplace), q, searchNext, function(
      event,
      query
    ) {
      var keyName = CodeMirror.keyName(event);
      var extra = cm.getOption("extraKeys"),
        cmd =
          (extra && extra[keyName]) ||
          CodeMirror.keyMap[cm.getOption("keyMap")][keyName];
      if (
        cmd == "findNext" ||
        cmd == "findPrev" ||
        cmd == "findPersistentNext" ||
        cmd == "findPersistentPrev"
      ) {
        CodeMirror.e_stop(event);
        startSearch(cm, getSearchState(cm), query);
        cm.execCommand(cmd);
      } else if (cmd == "find" || cmd == "findPersistent") {
        CodeMirror.e_stop(event);
        searchNext(query, event);
      }
    });
    if (immediate && q) {
      startSearch(cm, state, q);
      findNext(cm, rev);
    }
  } else {
    dialog(cm, getQueryDialog(cm, isReplace), "Search for:", q, function(query) {
      if (query && !state.query)
        cm.operation(function() {
          startSearch(cm, state, query);
          state.posFrom = state.posTo = cm.getCursor();
          findNext(cm, rev);
        });
    });
  }
}

function findNext(cm, rev, callback) {
  cm.operation(function() {
    var state = getSearchState(cm);
    var cursor = getSearchCursor(
      cm,
      state.query,
      rev ? state.posFrom : state.posTo
    );
    if (!cursor.find(rev)) {
      cursor = getSearchCursor(
        cm,
        state.query,
        rev ? CodeMirror.Pos(cm.lastLine()) : CodeMirror.Pos(cm.firstLine(), 0)
      );
      if (!cursor.find(rev)) return;
    }
    cm.setSelection(cursor.from(), cursor.to());
    cm.scrollIntoView({ from: cursor.from(), to: cursor.to() }, 20);
    state.posFrom = cursor.from();
    state.posTo = cursor.to();
    if (callback) callback(cursor.from(), cursor.to());
  });
}

function clearSearch(cm) {
  cm.operation(function() {
    var state = getSearchState(cm);
    state.lastQuery = state.query;
    if (!state.query) return;
    state.query = state.queryText = null;
    cm.removeOverlay(state.overlay);
    if (state.annotate) {
      state.annotate.clear();
      state.annotate = null;
    }
  });
}

function closeAndClear(cm) {
  if (typeof closer === 'function') {
    clearSearch(cm)
    const highlight = document.querySelectorAll('.CodeMirror .cm-matchhighlight')

    if (highlight) {
      highlight.forEach(dom => {
        dom.classList.remove('cm-matchhighlight')
      })
    }
    const selectedText = document.querySelectorAll('.CodeMirror .CodeMirror-selected')
    if (selectedText && selectedText[0]) {
      selectedText[0].parentNode.removeChild(selectedText[0])
    }

    closer()
  }
}

function getQueryDialog(cm, isReplace = false) {
  const queryBox = document.createElement('div')
  queryBox.className = 'query-box'

  const queryField = document.createElement('div')
  queryField.className = 'query-field'
  queryField.innerHTML = '<input class="CodeMirror-search-field" id="CodeMirror-find-field" placeholder="查找" />'
  queryBox.appendChild(queryField)

  if (isReplace) {
    const replaceField = document.createElement('div')
    replaceField.className = 'replace-field'
    replaceField.innerHTML = '<input class="CodeMirror-replace-field" id="CodeMirror-replace-field" placeholder="替换" />'
    replaceField.onclick = e => {
      e.stopPropagation()
    }
    queryBox.appendChild(replaceField)
  }

  const queryBtns = document.createElement('div')
  queryBtns.className = 'query-btns'

  const queryBtnInfo = [{
    text: '<i class="iconfont icondown31"></i>',
    rev: false,
    title: '下一个匹配项'
  }, {
    text: '<i class="iconfont iconup3"></i>',
    rev: true,
    title: '上一个匹配项'
  }]
  const fragment = document.createDocumentFragment()
  queryBtnInfo.forEach(({ text, rev, title }) => {
    const span = document.createElement("span")
    span.className = 'operate-btn'
    span.innerHTML = text
    span.setAttribute('title', title)
    span.onclick = function () {
      const query = document.getElementById('CodeMirror-find-field').value
      var state = getSearchState(cm);
      startSearch(cm, state, query);
      findNext(cm, rev)

      // if (query && !state.query) {
      //   cm.operation(function() {
      //     startSearch(cm, state, query);
      //     state.posFrom = state.posTo = cm.getCursor();
      //     console.log(state)
      //     findNext(cm, true);
      //   });
      // }
      
    }
    fragment.appendChild(span)
  })
  queryBtns.appendChild(fragment)
  queryBox.appendChild(queryBtns)

  if (isReplace) {
    const replaceBtns = document.createDocumentFragment()
    const replaceBtnInfo = [{
      text: '<i class="iconfont icondisplace1"></i>',
      isReplaceAll: false,
      title: '替换'
    }, {
      text: '<i class="iconfont icondisplaceall"></i>',
      isReplaceAll: true,
      title: '全部替换'
    }]
    const replaceFragment = document.createDocumentFragment()
    replaceBtnInfo.forEach(({ text, isReplaceAll, title }) => {
      const span = document.createElement("span")
      span.className = 'replace-btns'
      span.innerHTML = text
      span.setAttribute('title', title)

      span.onclick = function () {
        const query = document.getElementById('CodeMirror-find-field').value
        const replace = document.getElementById('CodeMirror-replace-field').value
        if (isReplaceAll) {
          replaceAll(cm, query, replace)
        } else {
          replaceOne(cm, query, replace)
        }
      }

      replaceFragment.appendChild(span)
    })
    replaceBtns.appendChild(replaceFragment)
    queryBox.appendChild(replaceBtns)
  }

  const close = document.createElement('span')
  close.className = 'close-btn'
  close.innerHTML = '<i class="el-icon-close"></i>'
  close.setAttribute('title', '关闭')
  close.onclick = function () {
    closeAndClear(cm)
  }
  queryBox.appendChild(close)

  return queryBox

  // `
  //   <div class="query-box" id="gpl-query">
  //     <div class="query-field">
  //       <input lass="CodeMirror-search-field"/>
  //     </div>
  //     <div class="query-btns">
  //       <span>上</span>
  //       <span>下</span>
  //       <span>all</span>
  //       <span></span>
  //     </div>
  //   </div>
  // `
  // return (
  //   '<span class="CodeMirror-search-label">' +
  //   cm.phrase("Search:") +
  //   '</span> <input type="text" style="width: 10em" class="CodeMirror-search-field"/> <span style="color: #888" class="CodeMirror-search-hint">' +
  //   cm.phrase("(Use /re/ syntax for regexp search)") +
  //   "</span>"
  // );
}
function getReplaceQueryDialog(cm) {
  return (
    ' <input type="text" style="width: 10em" class="CodeMirror-search-field"/> <span style="color: #888" class="CodeMirror-search-hint">' +
    cm.phrase("(Use /re/ syntax for regexp search)") +
    "</span>"
  );
}
function getReplacementQueryDialog(cm) {
  return (
    '<span class="CodeMirror-search-label">' +
    cm.phrase("With:") +
    '</span> <input type="text" style="width: 10em" class="CodeMirror-search-field"/>'
  );
}
function getDoReplaceConfirm(cm) {
  return (
    '<span class="CodeMirror-search-label">' +
    cm.phrase("Replace?") +
    "</span> <button>" +
    cm.phrase("Yes") +
    "</button> <button>" +
    cm.phrase("No") +
    "</button> <button>" +
    cm.phrase("All") +
    "</button> <button>" +
    cm.phrase("Stop") +
    "</button> "
  );
}

function replaceOne(cm, query, text) {
  cm.operation(function() {
    var cursor = getSearchCursor(cm, query)
    if (cursor.findNext()) {
      var match = cm.getRange(cursor.from(), cursor.to()).match(query);
      cursor.replace(
        text.replace(/\$(\d)/, function(_, i) {
          return match[i];
        })
      );
    }
  });
}

function replaceAll(cm, query, text) {
  cm.operation(function() {
    for (var cursor = getSearchCursor(cm, query); cursor.findNext(); ) {
      if (typeof query != "string") {
        var match = cm.getRange(cursor.from(), cursor.to()).match(query);
        cursor.replace(
          text.replace(/\$(\d)/g, function(_, i) {
            return match[i];
          })
        );
      } else cursor.replace(text);
    }
  });
}

function replace(cm, all) {
  if (cm.getOption("readOnly")) return;
  var query = cm.getSelection() || getSearchState(cm).lastQuery;
  var dialogText =
    '<span class="CodeMirror-search-label">' +
    (all ? cm.phrase("Replace all:") : cm.phrase("Replace:")) +
    "</span>";
  dialog(
    cm,
    dialogText + getReplaceQueryDialog(cm),
    dialogText,
    query,
    function(query) {
      if (!query) return;
      query = parseQuery(query);
      dialog(
        cm,
        getReplacementQueryDialog(cm),
        cm.phrase("Replace with:"),
        "",
        function(text) {
          text = parseString(text);
          if (all) {
            replaceAll(cm, query, text);
          } else {
            clearSearch(cm);
            var cursor = getSearchCursor(cm, query, cm.getCursor("from"));
            var advance = function() {
              var start = cursor.from(),
                match;
              if (!(match = cursor.findNext())) {
                cursor = getSearchCursor(cm, query);
                if (
                  !(match = cursor.findNext()) ||
                  (start &&
                    cursor.from().line == start.line &&
                    cursor.from().ch == start.ch)
                )
                  return;
              }
              cm.setSelection(cursor.from(), cursor.to());
              cm.scrollIntoView({ from: cursor.from(), to: cursor.to() });
              confirmDialog(
                cm,
                getDoReplaceConfirm(cm),
                cm.phrase("Replace?"),
                [
                  function() {
                    doReplace(match);
                  },
                  advance,
                  function() {
                    replaceAll(cm, query, text);
                  }
                ]
              );
            };
            var doReplace = function(match) {
              cursor.replace(
                typeof query == "string"
                  ? text
                  : text.replace(/\$(\d)/g, function(_, i) {
                      return match[i];
                    })
              );
              advance();
            };
            advance();
          }
        }
      );
    }
  );
}

CodeMirror.commands.find = function(cm) {
  clearSearch(cm);
  doSearch(cm);
};
CodeMirror.commands.findPersistent = function(cm) {
  clearSearch(cm);
  doSearch(cm, false, true);
};
CodeMirror.commands.findPersistentNext = function(cm) {
  doSearch(cm, false, true, true);
};
CodeMirror.commands.findPersistentPrev = function(cm) {
  doSearch(cm, true, true, true);
};
CodeMirror.commands.findNext = doSearch;
CodeMirror.commands.findPrev = function(cm) {
  doSearch(cm, true);
};
CodeMirror.commands.clearSearch = clearSearch;

// 防止冲突
// CodeMirror.commands.replace = replace;
// CodeMirror.commands.replaceAll = function(cm) {
//   replace(cm, true);
// };

CodeMirror.commands.replaceText = function (cm) {
  doSearch(cm, null, null, null, true)
}
