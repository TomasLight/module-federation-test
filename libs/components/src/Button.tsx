import { useContext, useState } from 'react';
import { CoreContext } from '@libs/core';
import { guid } from '@libs/utils';
import { DEFAULT_BUTTON_NAME } from '~components/constants';
import classes from './Button.module.scss';

type Props = {
  onClick: (mayBe?: string) => void;
};

const Button = (props: Props) => {
  const { onClick } = props;

  const [id] = useState(() => guid());
  const context = useContext(CoreContext);

  let buttonName = DEFAULT_BUTTON_NAME;
  if (context?.buttonName) {
    buttonName = context.buttonName;
  }

  return (
    <button id={id} className={classes.root} onClick={() => onClick()}>
      {buttonName}
    </button>
  );
};

export { Button };
export type { Props as ButtonProps };
