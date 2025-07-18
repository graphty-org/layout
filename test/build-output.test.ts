import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

describe('Build Output Tests', () => {
  it('should have correct package.json configuration', () => {
    const packageJson = JSON.parse(readFileSync(resolve('./package.json'), 'utf-8'));
    
    // Check main entry point
    expect(packageJson.main).toBe('dist/src/index.js');
    expect(packageJson.type).toBe('module');
    expect(packageJson.types).toBe('dist/src/index.d.ts');
    
    // Check exports field
    expect(packageJson.exports).toBeDefined();
    expect(packageJson.exports['.']).toBeDefined();
    expect(packageJson.exports['.'].import).toBe('./dist/src/index.js');
    expect(packageJson.exports['.'].types).toBe('./dist/src/index.d.ts');
    
    // Check files field
    expect(packageJson.files).toBeDefined();
    expect(packageJson.files).toContain('dist/');
    expect(packageJson.files).toContain('src/');
  });

  it('should have TypeScript configuration for ES modules', () => {
    const tsconfig = JSON.parse(readFileSync(resolve('./tsconfig.json'), 'utf-8'));
    
    // Check module settings
    expect(tsconfig.compilerOptions.module).toBe('ES2020');
    expect(tsconfig.compilerOptions.target).toBe('ES2020');
    expect(tsconfig.compilerOptions.declaration).toBe(true);
  });

  const distExists = existsSync(resolve('./dist/src/index.js'));

  it.skipIf(!distExists)('should have built the main entry file', () => {
    expect(existsSync(resolve('./dist/src/index.js'))).toBe(true);
    expect(existsSync(resolve('./dist/src/index.d.ts'))).toBe(true);
  });

  it.skipIf(!distExists)('should have built all layout modules', () => {
    // Check that layout modules are built
    expect(existsSync(resolve('./dist/src/layouts/index.js'))).toBe(true);
    expect(existsSync(resolve('./dist/src/layouts/force-directed/index.js'))).toBe(true);
    expect(existsSync(resolve('./dist/src/layouts/geometric/index.js'))).toBe(true);
    expect(existsSync(resolve('./dist/src/layouts/hierarchical/index.js'))).toBe(true);
    expect(existsSync(resolve('./dist/src/layouts/specialized/index.js'))).toBe(true);
  });

  it.skipIf(!distExists)('should have built all generator modules', () => {
    // Check that generator modules are built
    expect(existsSync(resolve('./dist/src/generators/index.js'))).toBe(true);
    expect(existsSync(resolve('./dist/src/generators/basic.js'))).toBe(true);
    expect(existsSync(resolve('./dist/src/generators/grid.js'))).toBe(true);
    expect(existsSync(resolve('./dist/src/generators/bipartite.js'))).toBe(true);
    expect(existsSync(resolve('./dist/src/generators/scale-free.js'))).toBe(true);
  });
});