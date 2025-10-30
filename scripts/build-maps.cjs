const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '..', 'dist');

// Copy all *.d.ts files to *.d.cts and *.d.ts.map files to *.d.cts.map
// Also update the sourceMappingURL in .d.cts files
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
        let content = fs.readFileSync(fullPath, 'utf8');
        // Update sourceMappingURL to point to .d.cts.map
        content = content.replace(/\/\/# sourceMappingURL=(.*)\.d\.ts\.map/g, '//# sourceMappingURL=$1.d.cts.map');
        fs.writeFileSync(ctsPath, content, 'utf8');
      }
    }
  }
}

copyDeclarations(distPath);
