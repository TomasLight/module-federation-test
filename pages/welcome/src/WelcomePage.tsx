import { useHistory } from 'react-router-dom';
import classes from './WelcomePage.module.scss';

const WelcomePage = () => {
  const history = useHistory();
  return (
    <div>
      <p>Welcome Page</p>

      <button
        className={classes.button}
        onClick={() => {
          history.push('/about');
        }}
      >
        go to about page
      </button>
    </div>
  );
};

export { WelcomePage };
