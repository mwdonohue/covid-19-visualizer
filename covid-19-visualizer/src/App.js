import "./App.css";
import React, { useEffect, useState } from "react";
import { LineChart, XAxis, YAxis, CartesianGrid, Line } from "recharts";
function App() {
  const [covidStates, setCovidStates] = useState([]);
  const [stateData, setStateData] = useState(undefined);
  const [graphData, setGraphData] = useState(undefined);

  useEffect(() =>
    fetch("https://api.covidtracking.com/v1/states/current.json")
      .then((response) => response.json())
      .then((data) => setCovidStates(data))
  );
  useEffect(() => {
    if (stateData !== undefined) {
      let currDate = new Date();
      let graphData = [];
      for (let i = 0; i <= 29; i++) {
        currDate.setDate(currDate.getDate() - 1);
        let dateString = (() => {
          return (
            currDate.getFullYear() +
            "" +
            getProperNum(currDate.getMonth() + 1) +
            "" +
            getProperNum(currDate.getDate())
          );
        })();
        fetch(
          "https://api.covidtracking.com/v1/states/" +
            stateData.state +
            "/" +
            dateString +
            ".json"
        )
          .then((response) => response.json())
          .then((data) =>
            graphData.unshift({
              name:
                dateString.substring(4, 6) + "/" + dateString.substring(6, 8),
              uv: data.positiveIncrease,
              pv: Math.random(),
              amt: Math.random(),
            })
          );
      }
      setGraphData(graphData);
    }
  }, [stateData]);

  function getProperNum(num) {
    if (num < 10) {
      return "0" + num;
    }
    return num;
  }
  const onLandMassChange = (e) => {
    setStateData(covidStates[e.target.value]);
  };

  return (
    <div className="App">
      <h1 className="title">COVID-19 Visualizer</h1>
      <select className="selectButton" onChange={onLandMassChange}>
        <option>Select a state</option>
        {covidStates.map((entry, index) => (
          <option key={index} value={index}>
            {entry.state}
          </option>
        ))}
      </select>
      <div className="table">
        {(() => {
          if (stateData !== undefined) {
            return (
              <div>
                <table>
                  <tbody>
                    <tr>
                      <th>Total Deaths:</th>
                      <td>{stateData.death}</td>
                    </tr>
                    <tr>
                      <th>Death Increase:</th>
                      <td>{stateData.deathIncrease}</td>
                    </tr>
                    <tr>
                      <th>Number Positive Increase:</th>
                      <td>{stateData.positiveIncrease}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          }
        })()}
      </div>
      <div className="graph">
        {(() => {
          if (graphData !== undefined && graphData.length === 30) {
            return (
              <LineChart width={600} height={300} data={graphData}>
                <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="name" />
                <YAxis />
              </LineChart>
            );
          }
        })()}
      </div>
    </div>
  );
}

export default App;
