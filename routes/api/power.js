module.exports = function (io) {
  // catch here
  const express = require('express');
  const router = express.Router();
  const socketIo = require('socket.io');
  const Power = require('../../models/Power');

  router.post('/create', async (req, res) => {
    let initVals = req.body;
    initVals.forEach(async (obj) => {
      let powerName = obj.name;
      let energy = obj.power;
      let cost = obj.cost;
      let energyCreate = new Power({
        powerName,
        energy,
        cost,
      });
      await energyCreate.save();
    });
    res.send('User created');
  });

  //  @route      POST api/update
  //  @desc       update User
  //  @access     Public
  router.post('/update', async (req, res) => {
    const input = req.body;
    var error = false;

    try {
      //let update;
      input.forEach(async (ele) => {
        let energyObj = {};
        energyObj.powerName = ele.name;
        energyObj.energy = ele.power;
        energyObj.cost = ele.cost;
        let temp = ele.name;
        let update2 = await Power.findOneAndUpdate(
          { powerName: temp },
          { $set: energyObj },
          { new: true }
        );
      });

      //res.send('User Modified');
    } catch (err) {
      console.error(err.message);
      error = true;
    }

    //send response back to client;
    let resObj = {
      electricity: {
        power: '',
        cost: '',
      },
      solar: {
        power: '',
        cost: '',
      },
      gas: {
        power: '',
        cost: '',
      },
      wind: {
        power: '',
        cost: '',
      },
    };

    let newEnergy = await Power.find();
    console.log(newEnergy);

    newEnergy.forEach((resource) => {
      resObj[resource.powerName].power = resource.energy;
      resObj[resource.powerName].cost = resource.cost;
    });

    console.log('RESOBJ');
    console.log(resObj);
    // io.on('connection', (socket) => {
    //   socket.emit('updateData', resObj);
    // });
    io.sockets.emit('updateData', resObj);

    res.send(resObj);
  });

  return router;
};
