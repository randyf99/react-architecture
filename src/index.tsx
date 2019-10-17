import React, { useEffect, useState } from 'react';
import { GraphQLString } from 'graphql';
import { Query } from 'react-apollo';
import{
  DataLayer,
  Entry,
  Environment,
  IsomorphicApp,
  Middleware,
  Route,
  serviceWithDataLayer,
  update,
  WebApp,
  withDataLayer,
  withIsoMorphicState
} from 'infrastructure-components';

const setDate = (d, hours) => (
  new Date(d.getFullYear(), d.getMonth(), d.getDate(), hours)
);

const pad = (n) => n < 10 ? '0'+n : n;

const utcstring = (d) => (
  d.getUTCFullYear()
    + "-" + pad(d.getUTCMonth() + 1)
    + "-" + pad(d.getUTCDate())
    + "-" + pad(d.getUTCHours())
);

export default (
  <IsomorphicApp
    stackName='happy-visits-v1-0-1'
    buildPath='build'
    assetsPath='assets'
    region='us-east-1'>

    <Environment name='dev' />

    <DataLayer id='datalayer'>
        <Entry
          id='visitentry'
          primaryKey='visittimestamp'
          data={{ visitcount: GraphQLString }}
        />

        <WebApp
          id='main'
          path='*'
          method='GET'>

          <Route
            path='/'
            name='React-Architect'
            render={withDataLayer((props) => (
              <div>
                <Query {...props.getEntryScanQuery('visitentry', {
                  visittimestamp: [
                    utcstring(setDate(new Date(), 0)),
                    utcstring(setDate(new Date(), 23))
                  ]
                })} >
                {
                  ({loading, data, error}) => (
                      loading && <div>Calculating...</div>
                    ) || (
                      data && <div>Total Visitors Today: {
                        data['scan_visitentry_visittimestamp'].reduce(
                          (total, entry) => total + parseInt(entry.visitcount), 0
                          )
                      }</div>
                    ) || (
                      <div>Error loading data</div>
                    )
                }
                </Query>
              </div>
            ))}>

            <Middleware callback={serviceWithDataLayer(

              async function(datalayer, request, response, next) {

                await update(
                  datalayer.client,
                  datalayer.updateEntryQuery('visitentry', data => ({
                    visittimestamp: utcstring(new Date()),
                    visitcount: data.visitcount ?
                      parseInt(data.visitcount) + 1 : 1
                  }))
                );
                next();
              }
            )}/>

          </Route>
        </WebApp>
      </DataLayer>
    </IsomorphicApp>
);