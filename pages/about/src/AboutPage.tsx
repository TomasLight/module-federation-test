import { useHistory } from 'react-router-dom';
import { Button } from '@libs/components';
import { CoreContext } from '@libs/core';
import { logger } from '@libs/utils';

const AboutPage = () => {
  const history = useHistory();
  return (
    <div>
      <p>About Page</p>

      <CoreContext.Provider value={{ buttonName: 'go to welcome page' }}>
        <Button
          onClick={() => {
            logger('about button click');
            history.push('/welcome');
          }}
        />
      </CoreContext.Provider>
    </div>
  );
};

export { AboutPage };
