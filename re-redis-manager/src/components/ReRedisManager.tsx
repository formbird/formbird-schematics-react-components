import React, { useState, useEffect } from 'react';
import { convertToCustomElement } from '../utils/CustomElementWrapper';
import { Table, Button, Paper, TableRow, TableHead, 
  TableContainer, TableCell, TableBody, TextField, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material';
import { Search, Delete } from '@mui/icons-material';
import { Notyf } from 'notyf';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";

async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

const notyf = new Notyf({
  position: {
      x: 'right',
      y: 'top',
  }
});

const ReRedisManager = ({}: any) => {

  const [filter, setFilter] = useState('');
  const [redisKeys, setRedisKeys] = useState([]);
  const [openView, setOpenView] = useState(false);

  const [selected, setSelected] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [viewData, setViewData] = useState('');

  useEffect(() => {
  	postData('/api/execute/redis-web-service/getAllKeys').then(result => {
      setRedisKeys(result);
    });
  }, []);

  return (<>
    <TextField label="Search" variant="standard" onChange={(e) => {
      setFilter(e.target.value);
    }} />
    
    <br/><br/>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell><b>Redis Key</b></TableCell>
            <TableCell align="right"><Button startIcon={<Delete />} variant="text" color='error' onClick={() => { setToDelete('all'); }}>Delete All</Button></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {redisKeys
            .filter(key => key.indexOf(filter) !== -1)
            .map((key: string) => {
            
            return <TableRow
              key={key}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell align="left">{key}</TableCell>
              <TableCell align="right">
                  <Button startIcon={<Search />} variant="text" color='primary' style={{marginRight: 5}} onClick={() => { 
                      postData('/api/execute/redis-web-service/getData', { functionParameters: { key } }).then(result => {
                        setViewData(JSON.stringify(result, null, 4));
                        setOpenView(true);
                        setSelected(key);
                      });
                  }}>View</Button>
                  <Button startIcon={<Delete />} variant="text" color='warning' onClick={() => { 
                    setToDelete(key);
                  }}>Delete</Button>
              </TableCell>
            </TableRow>;
        })}
        </TableBody>
      </Table>
    </TableContainer>
    <Dialog open={openView} onClose={() => { setOpenView(false); } } style={{ margin: 'auto', width: 800, maxHeight: 600 }}>
        <DialogTitle>{selected}</DialogTitle>
        <DialogContent>
          <AceEditor
            mode="javascript"
            theme="github"
            name="editor"
            minLines={10}
            maxLines={Infinity}
            showGutter={false}
            value={viewData}
            readOnly={true}
            editorProps={{ $blockScrolling: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenView(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={toDelete !== null}
        onClose={() => {
          setToDelete(null);
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete</DialogTitle>
        <DialogContent>
          {
            toDelete === 'all' && 
            <>
              <span style={{color: 'red', fontWeight: 'bold'}}>WARNING</span>
              <br/><br/>
              <span style={{color: 'red'}}>This will remove all keys from Redis, which will sign out all users and performance will be slower until data is re-cached.</span>
              <br/><br/>
            </>
          }
          <DialogContentText>Delete <b>{toDelete === 'all' ? 'all keys' : toDelete}</b>?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            postData('/api/execute/redis-web-service/removeData', { functionParameters: { key: toDelete } }).then(result => {
              if (toDelete === 'all') {
                setRedisKeys([]);
              } else {
                setRedisKeys([...redisKeys.filter((item) => item !== toDelete)]);
              }

              if (result === true) {
                setToDelete(null);
                notyf.success(toDelete + ' deleted!');
              } else {
                setToDelete(null);
                notyf.error('Error deleting ' + toDelete + '!');
              }
            }).catch(err => {
              notyf.error(err.message);
            });
          }} color="primary">
            Yes
          </Button>
          <Button onClick={() => {
             setToDelete(null);
          }}>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// register the component as a custom element so it can be shown in formbird
convertToCustomElement('re-redis-manager', ReRedisManager);

export default ReRedisManager;
