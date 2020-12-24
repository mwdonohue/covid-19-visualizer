import "./App.css";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Line,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
function App() {
  const [covidStates, setCovidStates] = useState([]);
  const [stateData, setStateData] = useState(undefined);
  const [graphData, setGraphData] = useState(undefined);
  useEffect(
    () =>
      fetch("https://api.covidtracking.com/v1/states/current.json")
        .then((response) => response.json())
        .then((data) => setCovidStates(data)),
    []
  );
  useEffect(() => {
    if (stateData !== undefined) {
      let currDate = new Date();
      let graphDataPromises = [];
      let gData = [];
      (async () => {
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
          graphDataPromises.unshift(
            fetch(
              "https://api.covidtracking.com/v1/states/" +
                stateData.state +
                "/" +
                dateString +
                ".json"
            ).then((response) => response.json())
          );
        }

        // A lot to unpack here. Promise.all takes in an iterable of promises, resolves every one of them, and then returns a promise that is an array
        // of results. Afterwards, the .then() takes in this promise as an input (thus "unpacking" it) and allows the data to be accessed.
        // .then returns a promise that resolves.
        // The "await" keyword waits for the second promise to resolve and pauses any action inside the async function.
        // setGraphData is in the async function for this reason: we want the data to be computed before putting it in the array
        // Ultimately, the await keyword is what makes this different than the promise clownery above.
        // Above, the graphDataPromise array is going to put the promises themselves in the array and not wait for them to resolve.
        // This is actually a good thing because it's *much* faster than awaiting up there for *each* date linearly
        await Promise.all(graphDataPromises).then((data) => {
          data.forEach((element) => {
            gData.push({
              name:
                element.date.toString().substring(4, 6) +
                "/" +
                element.date.toString().substring(6, 8),
              inc: element.positiveIncrease,
            });
          });
        });
        setGraphData(gData);
      })();
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
        <option>Select state</option>
        {covidStates.map((entry, index) => (
          <option key={index} value={index}>
            {entry.state}
          </option>
        ))}
      </select>
      <div className="table">
        {(() => {
          if (graphData !== undefined && stateData !== undefined) {
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
                      <th>Today's Positive Increase:</th>
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
          if (graphData !== undefined && stateData !== undefined) {
            return (
              <ResponsiveContainer width="99%" height={400}>
                <LineChart data={graphData}>
                  <Line type="monotone" dataKey="inc" stroke="#8884d8" />
                  <CartesianGrid stroke="#ccc" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip></Tooltip>
                </LineChart>
              </ResponsiveContainer>
            );
          }
        })()}
      </div>
    </div>
  );
}

export default App;
