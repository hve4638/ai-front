const vm = require('vm');
const fs = require('fs');

function runPlugin(pluginPath) {
    var sandbox = {
        print : (x)=>console.log(x),
        module : {},
    };
    
    vm.createContext(sandbox);
    const script = new vm.Script(code);
    script.runInContext(sandbox);
}

const code = `
    function onHandleRequestText(text) {
        return text;
    }
    function onHandleResponse(data) {
        return data;
    }
    module.exports = { onHandleRequestText, onHandleResponse }
`;

module.exports = {
    runPlugin
}