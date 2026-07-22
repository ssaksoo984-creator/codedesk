const KEYWORDS = new Set([
  "import",
  "export",
  "const",
  "let",
  "type",
  "function",
  "async",
  "await",
  "return",
  "default",
  "from",
  "of",
]);

const TOKEN_RE =
  /(\/\/.*$)|('(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|([{}()[\]:,.;<>=]+)/g;

interface Token {
  key: number;
  text: string;
  className: string;
}

function tokenize(line: string): Token[] {
  const tokens: Token[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  TOKEN_RE.lastIndex = 0;
  while ((match = TOKEN_RE.exec(line))) {
    if (match.index > lastIndex) {
      tokens.push({
        key: key++,
        text: line.slice(lastIndex, match.index),
        className: "",
      });
    }

    const [full, comment, string, number, word, punct] = match;
    let className = "text-white/70";
    if (comment) className = "text-white/35 italic";
    else if (string) className = "text-emerald-300/80";
    else if (number) className = "text-amber-300/80";
    else if (word && KEYWORDS.has(word)) className = "text-sky-300/90";
    else if (word) className = "text-white/85";
    else if (punct) className = "text-white/40";

    tokens.push({ key: key++, text: full, className });
    lastIndex = TOKEN_RE.lastIndex;
  }

  if (lastIndex < line.length) {
    tokens.push({ key: key++, text: line.slice(lastIndex), className: "" });
  }

  return tokens;
}

export function CodeLine({ line }: { line: string }) {
  if (line.trim() === "") {
    return <span className="block h-[1.6em]">&nbsp;</span>;
  }

  return (
    <span className="block h-[1.6em] whitespace-pre">
      {tokenize(line).map((token) => (
        <span key={token.key} className={token.className}>
          {token.text}
        </span>
      ))}
    </span>
  );
}
