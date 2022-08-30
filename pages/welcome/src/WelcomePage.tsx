import { useHistory } from 'react-router-dom';
import { WelcomeButton } from '~welcome/WelcomeButton';

const WelcomePage = () => {
  const history = useHistory();
  return (
    <div>
      <p>Welcome Page</p>

      <WelcomeButton
        onClick={() => {
          history.push('/about');
        }}
      />
    </div>
  );
};

export { WelcomePage };
