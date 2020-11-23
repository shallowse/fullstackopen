import React from 'react';
import { Feed, Icon, Divider, List } from 'semantic-ui-react';
import { SemanticICONS } from 'semantic-ui-react/dist/commonjs/generic';

import {
  Entry,
  EntryType,
  HealthCheckEntry,
  HealthCheckRating,
  HospitalEntry,
  OccupationalHealthcareEntry,
} from '../types';

const HealthCheck: React.FC<{ entry: HealthCheckEntry }> = ({ entry }) => {
  // Found from: node_modules/semantic-ui-react/dist/commonjs/element/Icon/Icon.d.ts
  let healthIcon: SemanticICONS;

  switch (entry.healthCheckRating) {
    case HealthCheckRating.CriticalRisk:
      healthIcon = 'ambulance';
      break;
    case HealthCheckRating.Healthy:
      healthIcon = 'thumbs up outline';
      break;
    case HealthCheckRating.HighRisk:
      healthIcon = 'warning sign';
      break;
    case HealthCheckRating.LowRisk:
      healthIcon = 'warning';
      break;
    default:
      healthIcon = 'ban'
  }

  return (
    <div>
      <Feed>
        <Feed.Event>
          <Feed.Label>
            <Icon name='doctor' />
          </Feed.Label>
          <Feed.Content>
            <Feed.Date>{entry.date}</Feed.Date>
            <Feed.Summary>
              <em>{entry.description}</em>
            </Feed.Summary>
            <Icon name={healthIcon} />
          </Feed.Content>
        </Feed.Event>
      </Feed>
      <Divider />
    </div>
  );
}

const Hospital: React.FC<{ entry: HospitalEntry }> = ({ entry }) => {
  return (
    <div>
      <Feed>
        <Feed.Event>
          <Feed.Label>
            <Icon name='hospital' />
          </Feed.Label>
          <Feed.Content>
            <Feed.Date>{entry.date}</Feed.Date>
            <Feed.Summary>
              <em>{entry.description}</em>
            </Feed.Summary>
            <List>
              <List.Item>
                <List.Content>
                  <List.Header>Discharge</List.Header>
                  <List.List>
                    <List.Item>
                      <List.Content>
                        <List.Header>date:</List.Header>
                        <List.Description>{entry.discharge.date}</List.Description>
                      </List.Content>
                    </List.Item>
                    <List.Item>
                      <List.Content>
                        <List.Header>criteria:</List.Header>
                        <List.Description>{entry.discharge.criteria}</List.Description>
                      </List.Content>
                    </List.Item>
                  </List.List>
                </List.Content>
              </List.Item>
            </List>
          </Feed.Content>
        </Feed.Event>
      </Feed>
      <Divider />
    </div>
  );
}

const OccupationalHealthcare: React.FC<{ entry: OccupationalHealthcareEntry }> = ({ entry }) => {
  return (
    <div>
      <Feed>
        <Feed.Event>
          <Feed.Label>
            <Icon name='heart' />
          </Feed.Label>
          <Feed.Content>
            <Feed.Date>{entry.date}</Feed.Date>
            <Feed.Summary>
              <p><em>{entry.description}</em></p>
              <p>Employer name:{' '}{entry.employerName}</p>
            </Feed.Summary>
            {entry.sickLeave &&
              <List>
                <List.Item>
                  <List.Content>
                    <List.Header>Sickleave</List.Header>
                    <List.List>
                      <List.Item>
                        <List.Content>
                          <List.Header>start date:</List.Header>
                          <List.Description>{entry.sickLeave?.startDate}</List.Description>
                        </List.Content>
                      </List.Item>
                      <List.Item>
                        <List.Content>
                          <List.Header>end date:</List.Header>
                          <List.Description>{entry.sickLeave?.endDate}</List.Description>
                        </List.Content>
                      </List.Item>
                    </List.List>
                  </List.Content>
                </List.Item>
              </List>
            }
          </Feed.Content>
        </Feed.Event>
      </Feed>
      <Divider />
    </div>
  );
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  //console.log(entry);

  let EntryTypeComponent: JSX.Element;
  switch (entry.type) {
    case EntryType.HealthCheck:
      EntryTypeComponent = <HealthCheck entry={entry} />;
      break;
    case EntryType.Hospital:
      EntryTypeComponent = <Hospital entry={entry} />;
      break;
    case EntryType.OccupationalHealthcare:
      EntryTypeComponent = <OccupationalHealthcare entry={entry} />;
      break;
    default:
      EntryTypeComponent = <h1>ERROR: This should not have happened...</h1>;
  }

  return EntryTypeComponent;
};

export default EntryDetails;
