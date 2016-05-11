var fs = require("fs"),
    recast = require("recast"),
    b = require("ast-types").builders;
    
var ast = recast.parse("m('div')", { sourceFileName : "source.js" });

recast.visit(ast, {
    visitCallExpression : function(path) {
        var node = path.node,
            now;
        
        now = path.replace(b.objectExpression([
            b.property("init", b.identifier("tag"), b.literal("div"))
        ]));
        
        now.original = node.loc;
        
        this.traverse(path);
    }
});

console.log(JSON.stringify(ast, null, 4));

var out = recast.print(ast, { sourceMapName : "source.map" });

fs.writeFileSync("c:/users/pcavit/desktop/source.js", out.code);
fs.writeFileSync("c:/users/pcavit/desktop/source.map", JSON.stringify(out.map));

console.log(out);
