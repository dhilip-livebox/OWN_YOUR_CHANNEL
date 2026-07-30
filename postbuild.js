import fs from 'fs';
import path from 'path';

// Define the routes that need physical index.html files for basic static servers
const routes = ['dashboard', 'purchase'];

const distDir = path.resolve('dist');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error("Error: dist/index.html not found. Run build first.");
  process.exit(1);
}

const indexContent = fs.readFileSync(indexPath, 'utf-8');

routes.forEach(route => {
  const routeDir = path.join(distDir, route);
  // Create directory if it doesn't exist (e.g. dist/dashboard)
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }
  
  // Copy index.html into that directory
  const targetPath = path.join(routeDir, 'index.html');
  fs.writeFileSync(targetPath, indexContent);
  console.log(`Generated physical file for route: /${route} -> ${targetPath}`);
});

console.log("Postbuild static route generation complete.");
