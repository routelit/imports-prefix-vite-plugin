import { describe, it, expect } from 'vitest';
import { addImportPrefix } from '../index';

describe('addImportPrefix plugin', () => {
  // Helper function to simulate Vite's bundle process
  function simulateBundleGeneration(plugin: any, code: string, fileName: string = 'test.js') {
    const bundle = {
      [fileName]: {
        type: 'chunk',
        fileName,
        code,
      },
    };
    
    plugin.generateBundle({}, bundle);
    return bundle[fileName].code;
  }

  it('should add prefix to relative imports with from statement', () => {
    const plugin = addImportPrefix({ prefix: '/my-prefix/' });
    const code = `import { something } from './relative-path';`;
    const result = simulateBundleGeneration(plugin, code);
    
    expect(result).toBe(`import { something } from '/my-prefix/relative-path';`);
  });

  it('should add prefix to relative imports with import statement', () => {
    const plugin = addImportPrefix({ prefix: '/my-prefix/' });
    const code = `import './relative-path';`;
    const result = simulateBundleGeneration(plugin, code);
    
    expect(result).toBe(`import '/my-prefix/relative-path';`);
  });

  it('should add prefix to relative imports with dynamic import', () => {
    const plugin = addImportPrefix({ prefix: '/my-prefix/' });
    const code = `const module = import('./relative-path');`;
    const result = simulateBundleGeneration(plugin, code);
    
    expect(result).toBe(`const module = import('/my-prefix/relative-path');`);
  });

  it('should handle imports with single quotes', () => {
    const plugin = addImportPrefix({ prefix: '/my-prefix/' });
    const code = `import { something } from './single-quote-path'`;
    const result = simulateBundleGeneration(plugin, code);
    
    expect(result).toBe(`import { something } from '/my-prefix/single-quote-path'`);
  });

  it('should handle imports with double quotes', () => {
    const plugin = addImportPrefix({ prefix: '/my-prefix/' });
    const code = `import { something } from "./double-quote-path"`;
    const result = simulateBundleGeneration(plugin, code);
    
    expect(result).toBe(`import { something } from "/my-prefix/double-quote-path"`);
  });

  it('should handle dynamic imports with spaces', () => {
    const plugin = addImportPrefix({ prefix: '/my-prefix/' });
    const code = `const module = import( './path-with-spaces' );`;
    const result = simulateBundleGeneration(plugin, code);
    
    expect(result).toBe(`const module = import( '/my-prefix/path-with-spaces' );`);
  });

  it('should not modify non-relative imports', () => {
    const plugin = addImportPrefix({ prefix: '/my-prefix/' });
    const code = `
      import { something } from 'non-relative-path';
      import 'another-non-relative';
      const module = import('third-non-relative');
    `;
    const result = simulateBundleGeneration(plugin, code);
    
    expect(result).toBe(code);
  });

  it('should respect the fileRegex option', () => {
    const plugin = addImportPrefix({ 
      prefix: '/my-prefix/',
      fileRegex: /\.css$/ 
    });
    
    // This should be processed (matches fileRegex)
    const cssCode = `import './styles.css';`;
    const cssResult = simulateBundleGeneration(plugin, cssCode, 'styles.css');
    expect(cssResult).toBe(`import '/my-prefix/styles.css';`);
    
    // This should not be processed (doesn't match fileRegex)
    const jsCode = `import './module.js';`;
    const jsResult = simulateBundleGeneration(plugin, jsCode, 'module.js');
    expect(jsResult).toBe(`import './module.js';`);
  });

  it('should handle multiple imports in the same file', () => {
    const plugin = addImportPrefix({ prefix: '/my-prefix/' });
    const code = `
      import { something } from './path1';
      import './path2';
      const module = import('./path3');
    `;
    const result = simulateBundleGeneration(plugin, code);
    
    expect(result).toBe(`
      import { something } from '/my-prefix/path1';
      import '/my-prefix/path2';
      const module = import('/my-prefix/path3');
    `);
  });

  it('should handle imports with file extensions', () => {
    const plugin = addImportPrefix({ prefix: '/my-prefix/' });
    const code = `
      import { something } from './path.js';
      import './style.css';
      const module = import('./module.jsx');
    `;
    const result = simulateBundleGeneration(plugin, code);
    
    expect(result).toBe(`
      import { something } from '/my-prefix/path.js';
      import '/my-prefix/style.css';
      const module = import('/my-prefix/module.jsx');
    `);
  });

  it('should handle nested paths', () => {
    const plugin = addImportPrefix({ prefix: '/my-prefix/' });
    const code = `import { something } from './nested/path/module';`;
    const result = simulateBundleGeneration(plugin, code);
    
    expect(result).toBe(`import { something } from '/my-prefix/nested/path/module';`);
  });
});
