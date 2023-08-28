const defineAst = async (
  outputDir: string,
  baseName: string,
  types: string[]
) => {
  const path = outputDir + "/" + baseName + ".ts";
  await Deno.writeTextFile(path, "");
  await Deno.writeTextFile(path, `import { Token } from "./Token.ts";`);
  await Deno.writeTextFile(path, `abstract class ${baseName} {`, {
    append: true,
  });
  for (const type of types) {
    const className = type.split("$")[0].trim();
    const fields = type.split("$")[1].trim();
    await defineType(path, baseName, className, fields);
  }
  await Deno.writeTextFile(path, ``, { append: true });
  await Deno.writeTextFile(path, ``, { append: true });
  await Deno.writeTextFile(path, ``, { append: true });

  await Deno.writeTextFile(path, `}`, { append: true });
};

const defineType = async (
  path: string,
  baseName: string,
  className: string,
  fieldList: string
) => {
  await Deno.writeTextFile(
    path,
    ` static ${className} = class extends ${baseName} {`,
    {
      append: true,
    }
  );
  const fields = fieldList.split(",").map((field) => field.trim());
  for (const field of fields) {
    const name = field.split(":")[0];
    await Deno.writeTextFile(path, ` const ${name};`, { append: true });
  }
  await Deno.writeTextFile(path, `constructor( ${fieldList}) {`, {
    append: true,
  });
  await Deno.writeTextFile(path, `super();`, { append: true });
  for (const field of fields) {
    const name = field.split(":")[0];
    await Deno.writeTextFile(path, `this.${name} = ${name};`, { append: true });
  }
  await Deno.writeTextFile(path, `}`, { append: true });
  await Deno.writeTextFile(path, "\n", { append: true });
  await Deno.writeTextFile(path, `};\n`, { append: true });
};
if (Deno.args.length !== 1) {
  console.log("Usage: generate_ast <output directory>");
  Deno.exit(64);
}

const outputDir = Deno.args[0];
defineAst(outputDir, "Expr", [
  "Binary $ left:Expr, operator:Token, right:Expr",
  "Grouping $ expression:Expr",
  "Literal $ value:any",
  "Unary $ operator:Token, right:Expr",
]);
