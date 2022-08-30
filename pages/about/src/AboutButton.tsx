import { Button } from '@libs/components';
import { CoreContext } from '@libs/core';

type Props = {
  onClick: () => void;
};

const AboutButton = (props: Props) => {
  const { onClick } = props;

  return (
    <CoreContext.Provider value={{ buttonName: 'go to welcome page' }}>
      <Button onClick={onClick} />
    </CoreContext.Provider>
  );
};

export { AboutButton };
