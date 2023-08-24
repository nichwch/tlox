class Lox {
  static hadError = false;
  static report(line: number, where: string, message: string) {
    console.error(`[line ${line}] Error ${where}: ${message}`);
    this.hadError = true;
  }

  static error(line: number, message: string) {
    this.report(line, "", message);
  }

  static async runFile(path: string) {
    const text = await Deno.readTextFile(path);
    console.log(text);
    this.run(text);
    if (this.hadError) Deno.exit(65);
  }

  static runPrompt() {
    for (;;) {
      const line = prompt(">");
      this.run(line);
      this.hadError = false;
    }
  }

  static run(line: string | null) {
    console.log(line);
  }
}
const file = Deno.args[0];

const lox = new Lox();
if (Deno.args.length > 1) {
  console.log("Usage: tlox [script]");
  Deno.exit(64);
} else if (Deno.args.length == 1) {
  Lox.runFile(file);
} else {
  Lox.runPrompt();
}
