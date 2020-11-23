import React from 'react';

export interface CourseName {
  name: string;
}

interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CourseDescription extends CoursePartBase {
  description: string;
}

interface CoursePartOne extends CoursePartBase, CourseDescription {
  name: 'Fundamentals';
}

interface CoursePartTwo extends CoursePartBase {
  name: 'Using props to pass data';
  groupProjectCount: number;
}

interface CoursePartThree extends CoursePartBase, CourseDescription {
  name: 'Deeper type usage';
  exerciseSubmissionLink: string;
}

interface CourseAddYourOwn extends CoursePartBase, CourseDescription {
  name: 'Add your own';
  extra: string;
}

type CoursePart = CoursePartOne | CoursePartTwo | CoursePartThree | CourseAddYourOwn;

interface Courses {
  courseParts: CoursePart[];
}

interface Course {
  course: CoursePart;
}

const Header: React.FC<CourseName> = ({ name }) => {
  return (
    <h1>{name}</h1>
  );
};

const Part: React.FC<Course> = ({ course }) => {
  let retElem: JSX.Element;

  switch (course.name) {
    case 'Fundamentals':
      retElem = (<p><em>{course.name}:</em>{' '}
      (descpription: {course.description}){' '}
      (exerciseCount: {course.exerciseCount})</p>);
      break;
    case 'Using props to pass data':
      retElem = (<p><em>{course.name}:</em>{' '}
      (exerciseCount: {course.exerciseCount}){' '}
      (groupProjectCount: {course.groupProjectCount})</p>);
      break;
    case 'Deeper type usage':
      retElem = (<p><em>{course.name}:</em>{' '}
        (description: {course.description}){' '}
        (exerciseCount: {course.exerciseCount}){' '}
        (exerciseSumbmissionlink: {course.exerciseSubmissionLink})</p>);
      break;
    case 'Add your own':
      retElem = (<p><em>{course.name}:</em>{' '}
      (descpription: {course.description}){' '}
      (exerciseCount: {course.exerciseCount})
      (extra: {course.extra})</p>);
      break;
    default:
      retElem = <p>Unknown name...</p>;
  }
  return retElem;
};

const Content: React.FC<Courses> = ({ courseParts }) => {
  return (
    <div>
      {courseParts.map(course => <Part key={course.name} course={course} />)}
    </div>
  );
  return <div>Hello</div>;
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
  const courseParts: CoursePart[] = [
    {
      name: 'Fundamentals',
      exerciseCount: 10,
      description: 'This is an awesome course part'
    },
    {
      name: 'Using props to pass data',
      exerciseCount: 7,
      groupProjectCount: 3
    },
    {
      name: 'Deeper type usage',
      exerciseCount: 14,
      description: 'Confusing description',
      exerciseSubmissionLink: 'https://fake-exercise-submit.made-up-url.dev'
    },
    {
      name: 'Add your own',
      exerciseCount: 20,
      description: 'Exercise 9.15.',
      extra: 'A random text',
    },
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
