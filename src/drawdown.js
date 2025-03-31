const rx_lt = /</g;
const rx_gt = />/g;
const rx_space = /\t|\r|\uf8ff/g;
const rx_escape = /\\([\\\|`*_{}\[\]()#+\-~])/g;
const rx_hr = /^([*\-=_] *){3,}$/gm;
const rx_blockquote = /\n *&gt; *([^]*?)(?=(\n|$){2})/g;
const rx_list =
  /\n( *)(?:[*\-+]|((\d+)|([a-z])|[A-Z])[.)]) +([^]*?)(?=(\n|$){2})/g;
const rx_listjoin = /<\/(ol|ul)>\n\n<\1>/g;
const rx_highlight =
  /(^|[^A-Za-z\d\\])(([*_])|(~)|(\^)|(--)|(\+\+)|`)(\2?)([^<]*?)\2\8(?!\2)(?=\W|_|$)/g;
const rx_code = /\n((```|~~~).*\n?([^]*?)\n?\2|((    .*?\n)+))/g;
const rx_link = /((!?)\[(.*?)\]\((.*?)( ".*")?\)|\\([\\`*_{}\[\]()#+\-.!~]))/g;
const rx_table = /\n(( *\|.*?\| *\n)+)/g;
const rx_thead = /^.*\n( *\|( *\:?-+\:?-+\:? *\|)* *\n|)/;
const rx_row = /.*\n/g;
const rx_cell = /\||(.*?[^\\])\|/g;
const rx_heading = /(?=^|>|\n)([>\s]*?)(#{1,6}) (.*?)( #*)? *(?=\n|$)/g;
const rx_para = /(?=^|>|\n)\s*\n+([^<]+?)\n+\s*(?=\n|<|$)/g;
const rx_stash = /-\d+\uf8ff/g;

/**
 * drawdown.js markdown-to-html processor by Adam Leggett
 * Minor updates to contemporary 2025 JavaScript
 */
export default function markdown(src) {
  let stash = [];
  let si = 0;

  src = "\n" + src + "\n";

  src = src.replace(rx_lt, "&lt;");
  src = src.replace(rx_gt, "&gt;");
  src = src.replace(rx_space, "  ");

  // blockquote
  src = blockquote(src);

  // horizontal rule
  src = src.replace(rx_hr, "<hr/>");

  // list
  src = list(src);
  src = src.replace(rx_listjoin, "");

  // code
  src = src.replace(rx_code, function (all, p1, p2, p3, p4) {
    stash[--si] = element(
      "pre",
      element("code", p3 || p4.replace(/^    /gm, ""))
    );
    return `${si}\uf8ff`;
  });

  // link or image
  src = src.replace(rx_link, function (all, p1, p2, p3, p4, p5, p6) {
    stash[--si] = p4
      ? p2
        ? `<img src="${p4}" alt="${p3}"/>`
        : `<a href="${p4}">${unesc(highlight(p3))}</a>`
      : p6;
    return `${si}\uf8ff`;
  });

  // table
  src = src.replace(rx_table, function (all, table) {
    var sep = table.match(rx_thead)[1];
    return (
      "\n" +
      element(
        "table",
        table.replace(rx_row, function (row, ri) {
          return row == sep
            ? ""
            : element(
                "tr",
                row.replace(rx_cell, function (all, cell, ci) {
                  return ci
                    ? element(
                        sep && !ri ? "th" : "td",
                        unesc(highlight(cell || ""))
                      )
                    : "";
                })
              );
        })
      )
    );
  });

  // heading
  src = src.replace(rx_heading, function (all, _, p1, p2) {
    return _ + element(`h${p1.length}`, unesc(highlight(p2)));
  });

  // paragraph
  src = src.replace(rx_para, function (all, content) {
    return element("p", unesc(highlight(content)));
  });

  // stash
  src = src.replace(rx_stash, function (all) {
    return stash[parseInt(all)];
  });

  return src.trim();
}

function blockquote(src) {
  return src.replace(rx_blockquote, function (all, content) {
    return element(
      "blockquote",
      blockquote(highlight(content.replace(/^ *&gt; */gm, "")))
    );
  });
}

function element(tag, content) {
  return `<${tag}>${content}</${tag}>`;
}

function highlight(src) {
  return src.replace(
    rx_highlight,
    function (all, _, p1, emp, sub, sup, small, big, p2, content) {
      return (
        _ +
        element(
          emp
            ? p2
              ? "strong"
              : "em"
            : sub
            ? p2
              ? "s"
              : "sub"
            : sup
            ? "sup"
            : small
            ? "small"
            : big
            ? "big"
            : "code",
          highlight(content)
        )
      );
    }
  );
}

function list(src) {
  return src.replace(rx_list, function (all, ind, ol, num, low, content) {
    var entry = element(
      "li",
      highlight(
        content
          .split(
            RegExp("\n ?" + ind + "(?:(?:\\d+|[a-zA-Z])[.)]|[*\\-+]) +", "g")
          )
          .map(list)
          .join("</li><li>")
      )
    );

    return (
      "\n" +
      (ol
        ? `<ol start="${
            num ? ol : parseInt(ol, 36) - 9
          }" style="list-style-type:${
            low ? "low" : "upp"
          }er-alpha">${entry}</ol>`
        : element("ul", entry))
    );
  });
}

function unesc(str) {
  return str.replace(rx_escape, "$1");
}
