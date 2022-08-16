import { useContext } from 'react';
import { CoreContext } from '@libs/core';
import { DEFAULT_BUTTON_NAME } from '~/constants';
import classes from './Button.module.scss';

type Props = {
  onClick: (mayBe?: string) => void;
};

const Button = (props: Props) => {
  const { onClick } = props;
  const context = useContext(CoreContext);

  let buttonName = DEFAULT_BUTTON_NAME;
  if (context?.buttonName) {
    buttonName = context.buttonName;
  }

  return (
    <button className={classes.root} onClick={() => onClick()}>
      {buttonName}
    </button>
  );
};

export { Button };
export type { Props as ButtonProps };
