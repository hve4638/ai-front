const path = require('path');
const fs = require('fs');

const defaultPromptList = {
    "prompts" : [
        {
            "name" : "없음",
            "key" : "noprompt",
            "path" : "noprompt"
        },
        {
            "name" : "템플릿",
            "key" : "template",
            "path" : "template",
            "vars" : [
                {
                    "name" : "lang",
                    "display_name" : "언어",
                    "type" : "select",
                    "select_ref" : "lang"
                }
            ]
        }
    ],
    "selects" : {
        "lang" : [
            { "name" : "한국어", "value" : "korean" },
            { "name" : "영어", "value" : "english" }
        ]
    }
}

const defaultNoPrompt = "{{:input}}";

const defaultTemplate = "{{::role system}}\n\
\n\
As a translator, I translate the request into {{lang}} and I will not response to anything other than the translation.\n\
\n\
{{::role user}}\n\
\n\
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