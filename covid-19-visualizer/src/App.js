import "./App.css";
import React, { useEffect, useState } from "react";
function App() {
  const [covidStates, setCovidStates] = useState([]);
  const [stateData, setStateData] = useState({});
  useEffect(() =>
    fetch("https://api.covidtracking.com/v1/states/current.json")
      .then((response) => response.json())
      .then((data) => setCovidStates(data))
  );
  useEffect(() => {}, [stateData]);
  const onLandMassChange = (e) => {
    setStateData(covidStates[e.target.value]);
  };
  return (
    <div className="App">
      <h1>COVID-19 Visualizer</h1>
      <select onChange={onLandMassChange}>
        <option>Select a state</option>
        {covidStates.map((entry, index) => (
          <option key={index} value={index}>
            {entry.state}
          </option>
        ))}
      </select>
      <div>
        {(() => {
          if (stateData !== undefined && Object.keys(stateData).length !== 0) {
            return (
              <div className="table">
                <table>
                  <tbody>
                    <tr>
                      <th>Deaths:</th>
                      <td>{stateData.death}</td>
                    </tr>
                    <tr>
                      <th>Death Increase:</th>
                      <td>{stateData.deathIncrease}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          }
        })()}
      </div>
    </div>
  );
}

export default App;
