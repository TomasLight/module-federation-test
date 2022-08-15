import { Button } from '@libs/components';
import { CoreContext, coreMethod } from '@libs/core';

function App() {
  return (
    <CoreContext.Provider value={{ buttonName: 'App button' }}>
      <Button
        onClick={() => {
          coreMethod();
          fetch('localhost:8080/api/env/config')
            .then((response) => {
              debugger;
              console.log(response);
            })
            .catch((error) => {
              debugger;
              console.log(error);
            });
        }}
      />
    </CoreContext.Provider>
  );
}

export { App };
