TextGrid = {};

TextGrid.toJSON = function (text, offset) {
    var obj = {};

    var lines = text.split("\n");
    
    var n = offset || 0;
    var depth = getDepth(lines[n]);

    while (n < lines.length && depth <= getDepth(lines[n])) {
        if (lines[n].indexOf(": size = ") != -1 || lines[n].indexOf("[]:") != -1) {//if line contains =
            //array
        }
        else if (lines[n].indexOf("=") != -1) {//if line contains =
            var keyValuePair = lines[n].split("=");

            if (keyValuePair.length != 2)
                throw new Meteor.Error("parsing-error");

            keyValuePair[0] = keyValuePair[0].replace(/\s/g,"");
            keyValuePair[1] = keyValuePair[1].trim().replace(/"/g,"");
            assign(obj,keyValuePair[0],keyValuePair[1]);
        }
        else if(lines[n].indexOf(":") != -1){
            var keyValuePair = lines[n].split(":");

            if (keyValuePair.length != 2)
                throw new Meteor.Error("parsing-error");

            var possibleArrayEntry = keyValuePair[0].replace(/[\s\]]/g,"").split("[");
            if(possibleArrayEntry.length == 2)
                possibleArrayEntry[1]--; //Correcting Praats wierd counting

            keyValuePair[0] = possibleArrayEntry.join(".");


            var child = TextGrid.toJSON(text,n+1);
            n = child.line; 
            keyValuePair[1] = child.obj;

            assign(obj,keyValuePair[0],keyValuePair[1]);
        }
        n++;
    }
    return {
        obj: obj ,
         line: n - 1 //since we didn't process the last line'
         };

}

function getDepth(line) {
    return line.split("\t").length - 1
}

function assign(obj, prop, value) {
    if (typeof prop === "string")
        prop = prop.split(".");

    if (prop.length > 1) {
        var e = prop.shift();
        assign(obj[e] =
                Object.prototype.toString.call(obj[e]) === "[object Object]"
                    ? obj[e]
                    : {},
            prop,
            value);
    } else
        obj[prop[0]] = value;
}