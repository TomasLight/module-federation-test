import { Button, HmrIndicator } from '@libs/components';
import { CoreContext, coreMethod } from '@libs/core';

// use something like "dotenv" to get access to your env variables in web
// const isDevMode = process?.env?.NODE_ENV === 'development';
const isDevMode = false;

function App() {
  return (
    <CoreContext.Provider value={{ buttonName: 'App button' }}>
      {isDevMode && <HmrIndicator />}

      <Button
        onClick={() => {
          coreMethod();

          fetch('/api/env/config')
            .then((response) => response.json())
            .then((data) => {
              console.log('request is succeeded', data);
            })
            .catch(() => {
              console.log('request is failed');
            });
        }}
      />
    </CoreContext.Provider>
  );
}

export { App };
