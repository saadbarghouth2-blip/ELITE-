const fs = require('fs');
const path = require('path');

const filePath = path.join('src', 'pages', 'Menu.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const replacer = (match, prefix, name, oldUrl, suffix) => {
  const query = `${name} food`;
  const url = `https://source.unsplash.com/1200x900/?${encodeURIComponent(query)}`;
  return `${prefix}${url}${suffix}`;
};

content = content.replace(/(\{[^}]*?name:\s*'([^']+)'[^}]*?image:\s*')([^']*)(')/g, replacer);

fs.writeFileSync(filePath, content);
console.log('Updated menu images with strict object matching.');
