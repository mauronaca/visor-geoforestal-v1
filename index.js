import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { router } from './src/routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const app = express();

app.use(express.json({limit : '2gb'}));

// Static files
app.use(express.static(path.join(__dirname, 'src/public')));

// Routes
app.use(router);

// Start server listening on port 3000
const portID = 3000;
app.listen(portID, () => {
  console.log("App running on port", portID);
});
