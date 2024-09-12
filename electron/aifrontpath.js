const path = require('path');
const { app } = require('electron');

const documentsPath = app.getPath("documents");
const basePath = path.join(documentsPath, "AIFront");

module.exports = {
    basePath
}