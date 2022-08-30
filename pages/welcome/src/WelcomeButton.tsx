import classes from '~welcome/WelcomeButton.module.scss';

type Props = {
  onClick: () => void;
};

const WelcomeButton = (props: Props) => {
  const { onClick } = props;

  return (
    <button className={classes.button} onClick={onClick}>
      go to about page
    </button>
  );
};

export { WelcomeButton };
