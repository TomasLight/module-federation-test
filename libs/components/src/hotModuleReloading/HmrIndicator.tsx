import { useEffect, useState } from 'react';
import classes from './HmrIndicator.module.scss';

const HmrIndicator = () => {
  const [isBuilding, setIsBuilding] = useState(false);

  useEffect(() => {
    const hmrEventSource = new EventSource('/__webpack_hmr');
    hmrEventSource.addEventListener('message', (event: MessageEvent<any>) => {
      if (!event.data) {
        return;
      }

      let parsed: { action?: string };
      try {
        parsed = JSON.parse(event.data);
      } catch {
        return;
      }

      if (!parsed) {
        return;
      }

      switch (parsed.action) {
        case 'building':
          setIsBuilding(true);
          break;

        case 'built':
          setIsBuilding(false);
          break;
      }
    });
  }, []);

  if (!isBuilding) {
    return null;
  }

  return (
    <div className={classes.root}>
      <p className={classes.indicator}>Building...</p>
    </div>
  );
};

export { HmrIndicator };
