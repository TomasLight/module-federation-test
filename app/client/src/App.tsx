import { HmrIndicator } from '@libs/components';
import { VFC } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import loadable from '@loadable/component';

const fallback = <>loading...</>;

const WelcomePage = loadable(() => import(/* webpackChunkName: "page-welcome" */ '@pages/welcome'), {
  resolveComponent: (components) => components.WelcomePage,
  fallback,
}) as VFC;
const AboutPage = loadable(() => import(/* webpackChunkName: "page-about" */ '@pages/about'), {
  resolveComponent: (components) => components.AboutPage,
  fallback,
}) as VFC;

// use something like "dotenv" to get access to your env variables in web
// const isDevMode = process?.env?.NODE_ENV === 'development';
const isDevMode = false;

function App() {
  return (
    <BrowserRouter>
      {isDevMode && <HmrIndicator />}

      <Switch>
        <Route path="/about">
          <AboutPage />
        </Route>
        <Route path={['/welcome', '/']}>
          <WelcomePage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export { App };
