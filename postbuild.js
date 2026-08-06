import fs from 'fs';
import path from 'path';

// /purchase and /resources are client-side routes rendered inside index.html's SPA bundle —
// there's no real dist/purchase.html. Dumb static file hosts (no SPA rewrite support) 404
// on refresh unless a physical index.html copy exists at that path.
const routes = ['purchase', 'resources', 'account', 'profile'];

const distDir = path.resolve('dist');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error("Error: dist/index.html not found. Run build first.");
  process.exit(1);
}

const indexContent = fs.readFileSync(indexPath, 'utf-8');

routes.forEach(route => {
  const routeDir = path.join(distDir, route);
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }

  const targetPath = path.join(routeDir, 'index.html');
  fs.writeFileSync(targetPath, indexContent);
  console.log(`Generated physical file for route: /${route} -> ${targetPath}`);
});

console.log("Postbuild static route generation complete.");
