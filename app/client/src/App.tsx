import { Button } from '@libs/components';
import { CoreContext, coreMethod } from '@libs/core';

function App() {
  return (
    <CoreContext.Provider value={{ buttonName: 'App button' }}>
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
