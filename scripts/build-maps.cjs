const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');

// Copy all *.d.ts files to *.d.cts and *.d.ts.map files to *.d.cts.map
function copyDeclarations(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      copyDeclarations(fullPath);
    } else if (entry.isFile()) {
      if (entry.name.endsWith('.d.ts.map')) {
        const ctsMapPath = fullPath.replace('.d.ts.map', '.d.cts.map');
        fs.copyFileSync(fullPath, ctsMapPath);
      } else if (entry.name.endsWith('.d.ts')) {
        const ctsPath = fullPath.replace('.d.ts', '.d.cts');
        fs.copyFileSync(fullPath, ctsPath);
      }
    }
  }
}

copyDeclarations(distPath);
