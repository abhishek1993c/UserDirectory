import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';
import {
  AppBar,
  Typography,
  Container,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  TextField,
} from '@material-ui/core';
import axios from 'axios';
import MUIDataTable from 'mui-datatables';

axios.defaults.headers.post['Content-Type'] = 'application/json';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(3),
  },
  button: {
    margin: theme.spacing(1, 1, 0, 0),
  },
}));

const Home = () => {
  const classes = useStyles();
  const baseForm = Object.freeze({
    name: '',
    email: '',
    phoneNumber: 0,
    gender: '',
    department: '',
    location: '',
  });
  const [userForm, setUserForm] = React.useState(baseForm);
  const [alertStatus, setAlertStatus] = React.useState(null);
  const handleSubmit = (event) => {
    event.preventDefault();
    dbCall(userForm);
  };

  const dbCall = (form) => {
    axios
      .post('/api/users/create', form)
      .then((res) => {
        //access the results here....
        console.log(res);
        if (res.status === 200) setAlertStatus('Success');
      })
      .catch((e) => {
        if (e.response) {
          let err = e.response.data.errors;
          let errString = '';
          err.forEach((er) => {
            errString += er.msg + '. ';
          });
          setAlertStatus(errString);
        }
        console.log(e);
      });
  };

  const handleChange = (e) => {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value.trim(),
    });
  };

  const IsAlert = () => {
    if (alertStatus === 'Success') {
      return (
        <Alert
          severity='success'
          onClose={() => {
            setAlertStatus(null);
          }}
        >
          User has been successfully added in the database.
        </Alert>
      );
    } else if (alertStatus) {
      return (
        <Alert
          severity='error'
          onClose={() => {
            setAlertStatus(null);
          }}
        >
          {alertStatus}
        </Alert>
      );
    } else {
      return null;
    }
  };

  const columns = [
    'name',
    'gender',
    'email',
    'phoneNumber',
    'department',
    'location',
    'createdDate',
  ];

  const [data, setData] = React.useState([]);

  const refreshData = () => {
    axios.get('/api/users').then((res) => {
      //access the results here....
      setData(res.data);
    });
  };
  useEffect(() => {
    refreshData();
  }, []);

  // useEffect(() => {
  //   // code to run on component mount
  //   axios.get('/api/users').then((res) => {
  //     //access the results here....
  //     setData(res.data);
  //   });
  // }, []);

  const options = {
    filterType: 'checkbox',
    download: false,
    print: false,
    viewColumns: false,
    isLoading: false,
    //serverSide: true,
    // onTableChange: (action, tableState) => {
    //   axios.get('/api/users').then((res) => {
    //     //access the results here....
    //     setData(res.data);
    //   });
    // },
  };

  return (
    <div>
      <AppBar position='static'>
        <Typography variant='h3' className={'header'}>
          User Dashboard
        </Typography>
      </AppBar>
      <Container maxWidth={false}>
        <Alert severity='warning'>
          <AlertTitle>NOTE:</AlertTitle>
          Since I was asked for a sample program, I have created a sample page
          with <strong>Material-UI, ReactJS, NodeJS and MongoDB</strong>. As of
          now, only <strong>user creation and viewing in the table </strong> is
          implemented. Do let me know of your feedback/suggestion at
          abhishek1993c@gmail.com
        </Alert>
        <form onSubmit={handleSubmit}>
          <br />
          <IsAlert />
          <FormLabel component='legend'>Fill to add a new User</FormLabel>
          <FormControl component='fieldset' className={classes.formControl}>
            <FormControlLabel
              control={<TextField name='name' />}
              label='Name: '
              labelPlacement='start'
              onChange={handleChange}
            />
            <FormControlLabel
              control={<TextField name='email' />}
              label='Email: '
              labelPlacement='start'
              onChange={handleChange}
            />
            <FormControlLabel
              control={<TextField name='phoneNumber' />}
              label='Phone: '
              labelPlacement='start'
              onChange={handleChange}
            />
            <FormControlLabel
              control={
                <RadioGroup
                  aria-label='gender'
                  name='gender'
                  value={userForm.gender}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value='male'
                    control={<Radio />}
                    label='Male'
                  />
                  <FormControlLabel
                    value='female'
                    control={<Radio />}
                    label='Female'
                  />
                </RadioGroup>
              }
              label='Gender: '
              labelPlacement='start'
            />
            <FormControlLabel
              control={<TextField name='department' />}
              label='Department: '
              labelPlacement='start'
              onChange={handleChange}
            />
            <FormControlLabel
              control={<TextField name='location' />}
              label='Location: '
              labelPlacement='start'
              onChange={handleChange}
            />
            <Button
              type='submit'
              variant='outlined'
              color='primary'
              className={classes.button}
            >
              Add User
            </Button>
          </FormControl>
        </form>
        <div>
          <Button variant='contained' color='primary' onClick={refreshData}>
            View / Refresh
          </Button>
          <MUIDataTable
            title={'User List'}
            data={data}
            columns={columns}
            options={options}
          />
        </div>
      </Container>
    </div>
  );
};

export default Home;
