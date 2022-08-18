import webpack from 'webpack';
import prodConfig from '../../client/webpack/config';

webpack(prodConfig, (error, stats) => {
  if (error) {
    console.error(error.stack || error);

    function hasDetails(maybeWithDetails: any): maybeWithDetails is { details: string } {
      return Boolean(maybeWithDetails.details);
    }
    if (hasDetails(error)) {
      console.error(error.details);
    }

    return;
  }

  const info = stats.toJson();

  if (stats.hasErrors()) {
    console.error(info.errors);
  }

  if (stats.hasWarnings()) {
    console.warn(info.warnings);
  }

  console.log('done');
});
