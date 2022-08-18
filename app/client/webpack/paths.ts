import * as path from 'path';

const clientPath = path.join(__dirname, '..');
const repoRoot = path.join(clientPath, '..', '..');
const dist = path.join(clientPath, '..', '..', 'dist');

const paths = {
  application: clientPath,
  repoRoot: repoRoot,
  libs: path.join(repoRoot, 'libs'),
  src: path.join(clientPath, 'src'),
  dist: dist,
  clientDist: path.join(dist, 'client'),
  public: path.join(clientPath, 'public'),
  entryPoint: path.join(clientPath, 'src', 'index.ts'),
  // nodeModules: path.join(clientPath, 'node_modules'),
  // rootNodeModules: path.join(repoRoot, 'node_modules'),

  join: (...paths: string[]) => {
    return path.join(...paths);
  },
};

export { paths };
