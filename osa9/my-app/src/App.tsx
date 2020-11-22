import React from 'react';
import { CourseName, Courses } from './types';

const Header: React.FC<CourseName> = (props) => {
  return (
    <h1>{props.name}</h1>
  );
};

const Content: React.FC<Courses> = ({ courseParts }) => {
  // console.log(courseParts);
  return (
    <div>
      {
        courseParts.map(course =>
          <p key={course.name}>{course.name}{' '}{course.exerciseCount}</p>)
      }
    </div>
  );
}

const Total: React.FC<Courses> = ({ courseParts }) => {
  return (
    <p>
      Number of exercises{' '}
      {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
    </p>
  );
};

const App: React.FC = () => {
  const courseName = 'Half Stack application development';
  const courseParts = [
    {
      name: 'Fundamentals',
      exerciseCount: 10
    },
    {
      name: 'Using props to pass data',
      exerciseCount: 7
    },
    {
      name: 'Deeper type usage',
      exerciseCount: 14
    }
  ];

  return (
    <div>
      <Header name={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts} />
    </div>
  );
};

export default App;
