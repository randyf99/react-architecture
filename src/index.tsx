import React from 'react';
import{
  Environment,
  IsomorphicApp,
  Route,
  WebApp
} from 'infrastructure-components';

export default (
  <IsomorphicApp
    stackName='happy-visits-v1-0-1'
    buildPath='build'
    assetsPath='assets'
    region='us-east-1'>

      <Environment name='dev' />

      <WebApp
        id='main'
        path='*'
        method='GET'>

        <Route
          path='/'
          name='React-Architect'
          render={(props) => (
            <div>Hello React-Architect!</div>
          )} />

      </WebApp>
    </IsomorphicApp>
);