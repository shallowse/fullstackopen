import React from 'react';
import ReactDOM from 'react-dom';

const Header = ({ course }) => {
  return (
    <h1>{course}</h1>
  );
};

const Part = ({ part, exercises }) => {
  return (
    <p>
      {part} {exercises}
    </p>
  );
};

const Content = ({ parts }) => {
  return (
    <div>
      {
        parts.map(x => <Part part={x.name} exercises={x.exercises} key={x.name} />)
      }
    </div>
  );
};

const Total = ({ parts }) => {
  return (
    <p>
      Number of excercises
      {parts.reduce((accumulator, currentValue) => accumulator + currentValue.exercises, 0)}
    </p>
  )
};

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  };
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
};

ReactDOM.render(<App />, document.getElementById('root'));
