TextGrid = {};

TextGrid.toJSON = function (text, offset) {
    var obj = {};

    var lines = text.split("\n");
    
    var n = offset || 0;
    var depth = getDepth(lines[n]);
    var arrayName; 
    var arrayIndex;

    while (n < lines.length && depth <= getDepth(lines[n])) {
        if (lines[n].indexOf(": size = ") != -1){
            //array
            arrayName = lines[n].split(": size = ")[0].replace(/[\s]/g,"");
            arrayIndex = 0;
            assign(obj,arrayName,[]);
        }else if(lines[n].indexOf("[]:") != -1) {
            //array
            arrayName = lines[n].split("[]:")[0].replace(/[\s]/g,"");
            arrayIndex = 0;
            assign(obj,arrayName,[]);
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

            keyValuePair[0] = keyValuePair[0].replace(/[\s]/g,"").replace(/\[.+\]/,"");
            
            var child = TextGrid.toJSON(text,n+1);
            n = child.line; 
            keyValuePair[1] = child.obj;

        if(keyValuePair[0] == arrayName)
            assignToArray(obj,keyValuePair[0],keyValuePair[1]);
            else
            assign(obj,keyValuePair[0],keyValuePair[1])
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

function assignToArray(obj, prop, value) {
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
        obj[prop[0]].push(value);
}