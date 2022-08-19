import path from 'path';
import { LoaderContext } from 'webpack';
import { Configuration } from 'webpack';
import { getHashDigest, interpolateName } from 'loader-utils';

const cssRegex = /\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

function cssRule(mode: Configuration['mode']) {
  const dontDropUnusedCssImports = {
    // disable tree-shaking for regular (not module) scss files
    // `import 'myStyles.scss';`
    // because in such cases webpack sees, the import not used, and it trys to drop it
    sideEffects: true,
  };

  return {
    module: {
      rules: [
        {
          test: cssRegex,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
          ...dontDropUnusedCssImports,
        },
        {
          test: sassRegex,
          exclude: sassModuleRegex,
          ...dontDropUnusedCssImports,

          use: [
            // to inject the result into the DOM as a style block
            'style-loader',

            // to convert the resulting CSS to Javascript to be bundled (modules:true to rename CSS classes in output to cryptic identifiers, except if wrapped in a :global(...) pseudo class)
            {
              loader: 'css-loader',
              options: {
                modules: {
                  getLocalIdent: originalNamedIdentifier(),
                },
              },
            },

            // future CSS syntax
            'postcss-loader',

            // to convert SASS to CSS
            'sass-loader',
          ],
        },
        {
          test: sassModuleRegex,
          ...dontDropUnusedCssImports,

          use: [
            // to inject the result into the DOM as a style block
            'style-loader',

            // to convert the resulting CSS to Javascript to be bundled (modules:true to rename CSS classes in output to cryptic identifiers, except if wrapped in a :global(...) pseudo class)
            {
              loader: 'css-loader',
              options: {
                modules: {
                  getLocalIdent: namedModuleIdentifier(),
                },
              },
            },

            // future CSS syntax
            'postcss-loader',

            // to convert SASS to CSS
            'sass-loader',

            // to generate a .d.ts module next to the .scss file (also requires a declaration.d.ts with "declare modules '*.scss';" in it to tell TypeScript that "import styles from './styles.scss';" means to load the module "./styles.scss.d.td")
            // { loader: "css-modules-typescript-loader" },
          ],
        },
      ],
    },
  };
}

function originalNamedIdentifier() {
  return <T>(
    context: LoaderContext<T>,
    identifier: string, // "[hash:base64:5]"
    className: string,
    options?: any
  ) => {
    return className;
  };
}

function namedModuleIdentifier() {
  return <T>(
    context: LoaderContext<T>,
    identifier: string, // "[hash:base64:5]"
    className: string,
    options?: any
  ) => {
    const relativePath = path
      .relative(
        // "<path-to-repo>\app"
        context.rootContext,
        // "<path-to-repo>\app\src\health\HealthDialog.module.scss"
        context.resourcePath
      )
      // to "src/health/HealthDialog.module.scss"
      .replace(/\\+/g, '/');

    // Generate a hash to make the class name unique.
    const hash = getHashDigest(Buffer.from(`filePath:${relativePath}#className:${className}`), 'md5', 'base64', 5);

    return (
      interpolateName(
        context as any,
        // "HealthDialog.module_errorList_hash"
        `[name]_${className}_${hash}`,
        options
      )
        // "HealthDialog.module_errorList_hash" -> "HealthDialog_errorList_hash"
        .replace(/\.module_/, '_')
    );
  };
}

export { cssRule };
