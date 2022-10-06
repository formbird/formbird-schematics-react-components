import React, { useState, useEffect } from 'react';
import { convertToCustomElement } from '../utils/CustomElementWrapper';
import { keyValueStorageService } from '../services';
import { Table, Button, Paper, TableRow, TableHead, 
  TableContainer, TableCell, TableBody } from '@mui/material';
import { Restore, Delete } from '@mui/icons-material';

const ReWorkInProgress = ({
  document,
  fieldValue,
  template,
  fieldName,
  formParameters,
  compKey,
  responsiveLayouts,
  message,
  componentDefinition
}) => {

  const [value, setValue] = useState();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (fieldValue) {
      setValue(fieldValue);
    } else if (componentDefinition.defaultValue) {
      setValue(componentDefinition.defaultValue);
    }

		keyValueStorageService.getDatabase().then(db => {
        db['keyValues'].toArray().then(wips => {
          setRows(wips);
        });
    });
		
		
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Last Update</TableCell>
            <TableCell>Key</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.filter(item => item.value).map(({ value, key }: any) => {
            const { document, updated } = value; 
            if (!document || !updated) {
              return;
            }
            
            return <TableRow
              key={value.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell align="left">{document.systemHeader.summaryName}</TableCell>
              <TableCell align="left">{updated.toLocaleDateString()}</TableCell>
              <TableCell align="left">{key}</TableCell>
              <TableCell align="right">
                  <Button startIcon={<Restore />} style={{marginRight: 10 }} variant="outlined" onClick={() => {
                    let id;
                    let basePath = '';

                    const baseTag = window.document.getElementsByTagName('base')[0];
                    if (baseTag) {
                        basePath = baseTag.href.split('/')[3] || '';
                    }

                    if (document && !document.systemHeader.createdDate) {
                      id = document.systemHeader.templateId;
                    } else {
                      id = document.documentId;
                    }

                    const initialDataKey = 'initialData:' + id;
                    localStorage.setItem(basePath + initialDataKey, JSON.stringify(document));
                    window.open('form/' + id, '_blank');
                  }}>Restore</Button>
                  <Button startIcon={<Delete />} variant="outlined" onClick={() => {
                    const key = `FB-CORE-WIP-${document.documentId}`;
                    keyValueStorageService.removeItem(key);

                    const wips = rows.filter(item => item.key !== key);
                    setRows(wips);
                  }}>Remove</Button>
              </TableCell>
            </TableRow>;
        })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// register the component as a custom element so it can be shown in formbird
convertToCustomElement('re-work-in-progress', ReWorkInProgress);

export default ReWorkInProgress;
