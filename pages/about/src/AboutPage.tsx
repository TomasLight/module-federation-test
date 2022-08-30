import { logger } from '@libs/utils';
import { useHistory } from 'react-router-dom';
import { AboutButton } from '~about/AboutButton';

const AboutPage = () => {
  const history = useHistory();
  return (
    <div>
      <p>About Page</p>
      <AboutButton
        onClick={() => {
          logger('about button click');
          history.push('/welcome');
        }}
      />
    </div>
  );
};

export { AboutPage };
