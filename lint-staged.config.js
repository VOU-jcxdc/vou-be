const path = require('path');

module.exports = {
  '{apps,libs,tools}/**/*.{ts,tsx}': files => {
    const relativeFiles = files.map(file => path.relative('.', file)).join(',');
    return [
      `nx affected --target=typecheck --files=${relativeFiles}`,
    ];
  },
  '{apps,libs,tools}/**/*.{js,ts,jsx,tsx,json}': files => {
    const relativeFiles = files.map(file => path.relative('.', file)).join(',');
    return [
      `nx affected:lint --files=${relativeFiles}`,
      `nx format:write --files=${relativeFiles}`,
    ];
  },
};