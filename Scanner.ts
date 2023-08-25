import { Token } from "./Token.ts";
import { TokenType } from "./TokenType.ts";
class Scanner {
  source: string;
  tokens: Token[] = [];
  start: number = 0;
  current: number = 0;
  line: number = 1;
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
    }
  }
  advance(): string {
    return this.source[this.current++];
  }
  addToken(type: TokenType, literal: any) {
    const text: string = this.source.substring(this.start, this.current);
    this.tokens.push(new Token(type, text, literal, this.line));
  }
}
