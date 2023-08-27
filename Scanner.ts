import { Token } from "./Token.ts";
import { TokenType } from "./TokenType.ts";
import { Lox } from "./Lox.ts";
export class Scanner {
  source: string;
  tokens: Token[] = [];
  start: number = 0;
  current: number = 0;
  line: number = 1;
  static keywords = new Map(
    Object.entries({
      and: TokenType.AND,
      class: TokenType.CLASS,
      else: TokenType.ELSE,
      false: TokenType.FALSE,
      for: TokenType.FOR,
      fun: TokenType.FUN,
      if: TokenType.IF,
      nil: TokenType.NIL,
      or: TokenType.OR,
      print: TokenType.PRINT,
      return: TokenType.RETURN,
      super: TokenType.SUPER,
      this: TokenType.THIS,
      true: TokenType.TRUE,
      var: TokenType.VAR,
      while: TokenType.WHILE,
    })
  );
  constructor(source: string) {
    this.source = source;
  }

  scanTokens(): Token[] {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }
    this.tokens.push(new Token(TokenType.EOF, "", null, this.line));
    return this.tokens;
  }

  isAtEnd(): boolean {
    return this.current >= this.source.length;
  }

  scanToken() {
    const c: string = this.advance();
    switch (c) {
      case "(":
        this.addToken(TokenType.LEFT_PAREN, null);
        break;
      case ")":
        this.addToken(TokenType.RIGHT_PAREN, null);
        break;
      case "{":
        this.addToken(TokenType.LEFT_BRACE, null);
        break;
      case "}":
        this.addToken(TokenType.RIGHT_BRACE, null);
        break;
      case ",":
        this.addToken(TokenType.COMMA, null);
        break;
      case ".":
        this.addToken(TokenType.DOT, null);
        break;
      case "-":
        this.addToken(TokenType.MINUS, null);
        break;
      case "+":
        this.addToken(TokenType.PLUS, null);
        break;
      case ";":
        this.addToken(TokenType.SEMICOLON, null);
        break;
      case "*":
        this.addToken(TokenType.STAR, null);
        break;
      case "!":
        this.addToken(
          this.match("=") ? TokenType.BANG_EQUAL : TokenType.BANG,
          null
        );
        break;
      case "=":
        this.addToken(
          this.match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL,
          null
        );
        break;
      case "<":
        this.addToken(
          this.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS,
          null
        );
        break;
      case ">":
        this.addToken(
          this.match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER,
          null
        );
        break;
      case "/":
        if (this.match("/")) {
          while (this.peek() !== "\n" && !this.isAtEnd()) this.advance();
        } else {
          this.addToken(TokenType.SLASH, null);
        }
        break;
      case " ":
      case "\r":
      case "\t":
        break;
      case "\n":
        this.line++;
        break;
      case '"':
        this.string();
        break;
      default:
        if (this.isDigit(c)) {
          this.number();
        } else if (this.isAlpha(c)) {
          this.identifier();
        } else {
          Lox.error(this.line, "Unexpected character.");
        }
        break;
    }
  }
  advance(): string {
    return this.source[this.current++];
  }
  addToken(type: TokenType, literal: any) {
    const text: string = this.source.substring(this.start, this.current);
    this.tokens.push(new Token(type, text, literal, this.line));
  }
  match(expected: string): boolean {
    if (this.isAtEnd()) return false;
    if (this.source[this.current] !== expected) return false;
    this.current++;
    return true;
  }
  peek(): string {
    if (this.isAtEnd()) return "\0";
    return this.source[this.current];
  }
  peekNext(): string {
    if (this.current + 1 >= this.source.length) return "\0";
    return this.source[this.current + 1];
  }
  string() {
    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === "\n") this.line++;
      this.advance();
    }
    if (this.isAtEnd()) {
      Lox.error(this.line, "Unterminated string.");
      return;
    }
    // handle closing "
    this.advance();
    const value: string = this.source.substring(
      this.start + 1,
      this.current - 1
    );
    this.addToken(TokenType.STRING, value);
  }
  isDigit(c: string) {
    return Number(c) >= 0 && Number(c) <= 9 && isNaN(Number(c));
  }

  number() {
    while (this.isDigit(this.peek())) this.advance();
    if (this.peek() === "." && this.isDigit(this.peekNext())) {
      this.advance();
      while (this.isDigit(this.peek())) this.advance();
    }
    this.addToken(
      TokenType.NUMBER,
      Number(this.source.substring(this.start, this.current))
    );
  }
  isAlpha(c: string) {
    return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c === "_";
  }
  identifier() {
    while (this.isAlphaNumeric(this.peek())) this.advance();
    const text: string = this.source.substring(this.start, this.current);
    let type = Scanner.keywords.get(text);
    if (!type) {
      type = TokenType.IDENTIFIER;
    }
    this.addToken(TokenType.IDENTIFIER, null);
  }
  isAlphaNumeric(c: string) {
    return this.isAlpha(c) || this.isDigit(c);
  }
}
