const file =  Deno.args[0];

if(Deno.args.length > 1) {
	console.log("Usage: tlox [script]");
	Deno.exit(64);
}
else if(Deno.args.length == 1) {
	runFile(file);
} else {
	runPrompt();
}

async function runFile(path:string) {
	const text = await Deno.readTextFile(path);
	console.log(text);
	run(text);
}

async function runPrompt() {

	for(;;) {
		const line = prompt(">");
		run(line);
	}
}

function run(line:string | null){
	console.log(line);
}
