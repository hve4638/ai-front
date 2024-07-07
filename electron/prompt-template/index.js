const path = require('path');
const fs = require('fs');

const defaultPromptList = {
    "prompts" : [
        {
            "name" : "없음",
            "key" : "noprompt",
            "value" : "noprompt"
        },
        {
            "name" : "템플릿",
            "key" : "template",
            "value" : "template"
        }
    ],
    "vars" : {}
}

const defaultNoPrompt = "{{:input}}";

const defaultTemplate = "{{::role system}}\
\
As a translator, I translate the request into {{lang}} and I will not response to anything other than the translation.\
\
{{::role user}}\
\
{{:input}}";

function initializePromptsDirectory(targetDirectory) {
    const listPath = path.join(targetDirectory, 'list.json');
    const noPromptPath = path.join(targetDirectory, 'noprompt');
    const templatePath = path.join(targetDirectory, 'template');

    fs.mkdirSync(targetDirectory, { recursive: true });
    if (!existsFile(listPath)) {
        fs.writeFileSync(listPath, JSON.stringify(defaultPromptList, null, 4), 'utf8');
        if (!existsFile(noPromptPath)) {
            fs.writeFileSync(noPromptPath, defaultNoPrompt, 'utf8');
        }
        if (!existsFile(templatePath)) {
            fs.writeFileSync(templatePath, defaultTemplate, 'utf8');
        }
    }
}

function existsFile(filePath) {
    try {
        fs.accessSync(filePath, fs.constants.F_OK);
        return true;
    } catch (err) {
        return false;
    }
}

module.exports = {
    initialize : initializePromptsDirectory
}