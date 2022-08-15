import * as path from 'path';

const clientPath = path.join(__dirname, '..');
const repoRoot = path.join(clientPath, '..', '..');
const paths = {
  application: clientPath,
  repoRoot: repoRoot,
  libs: path.join(repoRoot, 'libs'),
  src: path.join(clientPath, 'src'),
  dist: path.join(clientPath, '..', 'dist'),
  public: path.join(clientPath, 'public'),
  nodeModules: path.join(clientPath, 'node_modules'),
  rootNodeModules: path.join(repoRoot, 'node_modules'),

  join: (...paths: string[]) => {
    return path.join(...paths);
  },
};

export { paths };
