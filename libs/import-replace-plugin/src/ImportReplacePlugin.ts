import fs from 'fs';
import path from 'path';
import { ResolvePluginInstance, Resolver } from 'webpack/types';

const PLUGIN_NAME = 'ImportReplacePlugin';

/**
 * "import { generateId } from '~/generateId';"
 *  match[0] - "import { generateId } from '~/generateId';"
 *  match[1] - "'~/generateId'"
 *  match[2] - "~/"
 * */
const TildaES6ImportRegexp = /^import .* from (['"]\~\/.*['"]);?[\r]?/;
const lineSeparator = '\n';
const rootPath = path.join(__dirname, '..');

export class ImportReplacePlugin implements ResolvePluginInstance {
  apply(resolver: Resolver) {
    const addCallToHook = (hookName: string) => {
      resolver.getHook(hookName).tapAsync(PLUGIN_NAME, async (resolveRequest, resolveContext) => {
        if (typeof resolveRequest.path === 'string' && resolveRequest.path.endsWith('.ts')) {
          await this.replaceImport(resolveRequest.path, hookName);
        }
        return resolveRequest;
      });
    };

    // addCallToHook('described-resolve');
    addCallToHook('resolve');
    // addCallToHook('new-internal-resolve');
    // addCallToHook('raw-resolve');
    // addCallToHook('parsed-resolve');
    // addCallToHook('internal-resolve');
    // addCallToHook('normal-resolve');
    // addCallToHook('module');
    // addCallToHook('raw-file');
  }

  private async replaceImport(filePath: string, hook?: string) {
    const contentReplacingPromises: Promise<string>[] = [];

    const fileContent = await new Promise<string>((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (error, content) => {
        if (error) {
          reject(error);
        } else {
          resolve(content);
        }
      });
    });

    fileContent.split(lineSeparator).forEach((line) => {
      const match = TildaES6ImportRegexp.exec(line);
      if (match) {
        const [matchedLine, importPath, tildaWithSlash] = match;

        const promise = new Promise<string>((resolve, rejected) => {
          this.buildRelativePathFromClosestSrcFolder(filePath)
            .then((relativePathFromClosestSrc) => {
              const changedLine = line.replace(tildaWithSlash, relativePathFromClosestSrc);
              resolve(changedLine);
            })
            .catch((error) => rejected());
        });

        contentReplacingPromises.push(promise);
        return;
      }

      contentReplacingPromises.push(Promise.resolve(line));
    });

    const changedLines = await Promise.all(contentReplacingPromises);
    const newContent = changedLines.join(lineSeparator);
    fs.writeFile(filePath, newContent, function (err) {
      if (err) {
        return console.error(err);
      }
    });
  }

  private async buildRelativePathFromClosestSrcFolder(currentFilePath: string) {
    const pathUnixSeparator = '/';
    const pathWindowsSeparator = '\\';

    let pathParts = currentFilePath.split(pathUnixSeparator);
    if (pathParts.length === 0 || pathParts.length === 1) {
      pathParts = currentFilePath.split(pathWindowsSeparator);
    }

    let newPath = '';
    while (pathParts.length > 0 || !newPath) {
      const srcFolder = path.join(rootPath, ...pathParts, 'src');
      const srcFolderExists = await this.directoryExists(srcFolder);

      if (srcFolderExists) {
        newPath = pathParts.join(pathUnixSeparator);
      } else {
        pathParts.pop();
        newPath += '../';
      }
    }

    return newPath;
  }

  private async directoryExists(filePath: string) {
    try {
      await fs.promises.access(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }
}
