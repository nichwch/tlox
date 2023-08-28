const defineAst = async (
  outputDir: string,
  baseName: string,
  types: string[]
) => {
  const path = outputDir + "/" + baseName + ".ts";
  await Deno.writeTextFile(path, `abstract class ${baseName} {`, {
    append: true,
  });
  await Deno.writeTextFile(path, ``, { append: true });
  await Deno.writeTextFile(path, ``, { append: true });
  await Deno.writeTextFile(path, ``, { append: true });

  await Deno.writeTextFile(path, `}`, { append: true });
};

if (Deno.args.length !== 1) {
  console.log("Usage: generate_ast <output directory>");
  Deno.exit(64);
}
const outputDir = Deno.args[0];
defineAst(outputDir, "Expr", [
  "Binary : Expr left, Token operator, Expr right",
  "Grouping : Expr expression",
  "Literal : Object value",
  "Unary : Token operator, Expr right",
]);
