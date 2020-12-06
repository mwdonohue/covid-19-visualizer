import "./App.css";
import React, { useEffect, useState } from "react";
function App() {
  const [jsonData, setJsonData] = useState([]);

  useEffect(() => {
    const getJsonData = async () => {
      fetch("https://api.covidtracking.com/v1/states/current.json")
        .then((response) => response.json())
        .then((data) => {
          setJsonData(data);
        });
    };
    getJsonData();
  }, []);
  return (
    <div className="App">
      <h1>COVID-19 Visualizer</h1>
      {["state"].map((key) => (
        <select key={key}>
          {jsonData.map(({ [key]: value }) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      ))}
    </div>
  );
}

export default App;
