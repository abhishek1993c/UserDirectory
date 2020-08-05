import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import socketIOClient from 'socket.io-client';
import axios from 'axios';
const ENDPOINT = 'http://localhost:3000';

axios.defaults.headers.post['Content-Type'] = 'application/json';

const HomePage = () => {
  const [electricity, setElectricity] = React.useState({
    name: 'electricity',
    power: '0',
    cost: '0',
  });
  const [solar, setSolar] = React.useState({
    name: 'solar',
    power: '0',
    cost: '0',
  });
  const [gas, setGas] = React.useState({ name: 'gas', power: '0', cost: '0' });
  const [wind, setWind] = React.useState({
    name: 'wind',
    power: '0',
    cost: '0',
  });

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on('updateData', (data) => {
      //setResponse(data);
      setElectricity({
        power: data.electricity.power,
        cost: data.electricity.cost,
      });
      setSolar({
        power: data.solar.power,
        cost: data.solar.cost,
      });
      setGas({
        power: data.gas.power,
        cost: data.gas.cost,
      });
      setWind({
        power: data.wind.power,
        cost: data.wind.cost,
      });
    });
  }, []);

  return (
    <div>
      <h1>Portion of Energy</h1>
      <br />
      <br />
      <h3>Electricity:</h3>
      <span>
        {electricity.power} kWh
        <br />
        {electricity.cost} Baht
      </span>
      <br />
      <h3>Solar:</h3>
      <span>
        {solar.power} kWh
        <br />
        {solar.cost} Baht
      </span>
      <br />
      <h3>Gas:</h3>
      <span>
        {gas.power} kWh
        <br />
        {gas.cost} Baht
      </span>
      <br />
      <h3>wind:</h3>
      <span>
        {wind.power} kWh
        <br />
        {wind.cost} Baht
      </span>
    </div>
  );
};

export default HomePage;
