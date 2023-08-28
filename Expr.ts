import { Token } from "./Token.ts";abstract class Expr { static Binary = class extends Expr { const left; const operator; const right;constructor( left:Expr, operator:Token, right:Expr) {super();this.left = left;this.operator = operator;this.right = right;}
};
 static Grouping = class extends Expr { const expression;constructor( expression:Expr) {super();this.expression = expression;}
};
 static Literal = class extends Expr { const value;constructor( value:any) {super();this.value = value;}
};
 static Unary = class extends Expr { const operator; const right;constructor( operator:Token, right:Expr) {super();this.operator = operator;this.right = right;}
};
}