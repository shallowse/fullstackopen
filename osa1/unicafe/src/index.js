import React, { useState } from 'react';
import ReactDOM from 'react-dom';


const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const Statistics = ({
  good,
  neutral,
  bad,
}) => {

  const allValues = good + neutral + bad;
  let average, positive;
  if (allValues !== 0) {
    average = ((1 * good) + (0 * neutral) + (-1 * bad)) / allValues;
    positive = 100 * good / allValues;
  }

  if (allValues === 0) {
    return (
      <>
        <h2>statistics</h2>
        <p>No feedback given</p>
      </>
    );
  } else {
    return (
      <>
        <h2>statistics</h2>
        <table>
          <tbody>
            <StatisticLine text="good" value={good} />
            <StatisticLine text="neutral" value={neutral} />
            <StatisticLine text="bad" value={bad} />
            <StatisticLine text="all" value={allValues} />
            <StatisticLine text="average" value={average.toFixed(1)} />
            <StatisticLine text="positive" value={positive.toFixed(1) + ' %'} />
          </tbody>
        </table>
      </>
    );
  }
};


const Button = ({ handleClick, buttonText }) => {
  return (
    <button onClick={handleClick} style={{ marginRight: '10px' }}>{buttonText}</button>
  );
};


const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGood = () => setGood(good + 1);
  const handleNeutral = () => setNeutral(neutral + 1);
  const handleBad = () => setBad(bad + 1);

  return (
    <div>
      <h1>give feedback</h1>
      <Button
        handleClick={handleGood}
        buttonText='good'
      />

      <Button
        handleClick={handleNeutral}
        buttonText='neutral'
      />

      <Button
        handleClick={handleBad}
        buttonText='bad'
      />

      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

ReactDOM.render(<App />,
  document.getElementById('root')
);
