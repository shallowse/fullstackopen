import React from 'react';

const Header = ({ courseName }) => {
  return (
    <h1>{courseName}</h1>
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
        parts.map(x => <Part part={x.name} exercises={x.exercises} key={x.id} />)
      }
    </div>
  );
};

const Total = ({ parts }) => {
  return (
    <p>
      <strong>
        Total of&nbsp;
        {parts.reduce((accumulator, currentValue) => accumulator + currentValue.exercises, 0)}
        &nbsp;exercises
      </strong>
    </p>
  )
};

const Course = ({ course }) => {
  return (
    <div>
      <Header courseName={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  );
};

export default Course;
