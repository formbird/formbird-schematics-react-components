import React, { useState } from 'react';
import {
  Draggable,
  DragDropContext,
  Droppable
} from 'react-beautiful-dnd';
import { ListItem, ListItemAvatar, ListItemText, Avatar, DialogContentText, DialogTitle } from '@mui/material';
import { Inbox, Delete, Edit } from '@mui/icons-material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { TextField, Checkbox, FormGroup, FormControlLabel, Box } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-javascript";

const DraggableComponentItem = ({ componentDefinition, index, selected, onSelect, onEditClick, onDeleteClick }: any) => {
  return (
    <>
      <Draggable draggableId={componentDefinition.componentName + index} index={index} key={componentDefinition.componentName + index}>
        {(provided, snapshot) => (
          <ListItem
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={
              (snapshot.isDragging ? ' dragged ' : '') + 
              (selected ? ' selected ' : '') + 
              (componentDefinition.wrapAction ? ' wrapItem ' : '')
            }
            onClick={() => onSelect(componentDefinition, index)}
            secondaryAction=
            {
              selected &&
              <>
                <IconButton style={{margin: 2 }} edge="end" onClick={() => onEditClick(componentDefinition)}><Edit /></IconButton>
                <IconButton style={{margin: 2 }} edge="end" onClick={() => onDeleteClick(componentDefinition)}><Delete /></IconButton>
              </>
            }
          >
            <ListItemAvatar>
              <Avatar>
                <Inbox />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={componentDefinition.name} secondary={componentDefinition.componentName} />
          </ListItem>
        )}
      </Draggable>
    </>
  );
};

const DraggableComponentList = ({ components, onDrag, onSelect, onUpdate }: any) => {

  const [items, setItems] = useState(components);
  const [selected, setSelected] = useState({} as any);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  const [currentCompDef, setCurrentCompDef] = useState('');
  const [updatedCompDef, setUpdatedCompDef] = useState(null);

  const [fieldName, setFieldName] = useState('');
  const [label, setLabel] = useState('');
  const [fullWidth, setFullWidth] = useState(false);

  const [toDelete, setToDelete] = useState(null);

  const reorder = (list: any, startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = ({ destination, source }: any) => {
    if (!destination) return;
    const newItems: any = reorder(items, source.index, destination.index);
    setItems(newItems);

    onDrag(newItems);
  };

  const handleSelect = (componentDefinition, index) => {
    setSelected(componentDefinition);
    setSelectedIndex(index);
    onSelect(componentDefinition);
  };

  return (
    <>
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
          <DialogContentText>Delete {items[toDelete]?.name}?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            const newItems = [...items.filter((item, index) => index !== toDelete)];
            setItems(newItems);
            onUpdate(newItems);
            setToDelete(null);
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
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} style={{ margin: 'auto', width: 600, height: 'auto' }}>
        <DialogTitle>{selected.componentName}</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField variant="standard" label="Field Name" value={fieldName} onChange={event => {
              const name = event.target.value;
              setFieldName(name);
              updatedCompDef.name = name;
              setUpdatedCompDef(updatedCompDef);
              setCurrentCompDef(JSON.stringify(updatedCompDef, null, 4));
            }} />
            <TextField variant="standard" label="Label" value={label} onChange={event => {
              const label = event.target.value;
              setLabel(event.target.value);
              updatedCompDef.label = label;
              setUpdatedCompDef(updatedCompDef);
              setCurrentCompDef(JSON.stringify(updatedCompDef, null, 4));
            }} />
            <FormGroup>
              <FormControlLabel control={<Checkbox checked={fullWidth} onChange={event => {
                const fullWidth = event.target.checked;
                setFullWidth(event.target.checked);
                updatedCompDef.fullWidth = fullWidth;
                setUpdatedCompDef(updatedCompDef);
                setCurrentCompDef(JSON.stringify(updatedCompDef, null, 4));
              }} />} label="Full Width" />
            </FormGroup>
          </Box>
          <AceEditor
            mode="javascript"
            theme="github"
            name="editor"
            value={currentCompDef}
            onChange={(updated) => {
              setCurrentCompDef(updated);
              try {
                const parsed = JSON.parse(updated);
                setUpdatedCompDef(parsed);
              } catch (err) {
              }
            }}
            editorProps={{ $blockScrolling: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenDialog(false);
            items[selectedIndex] = updatedCompDef;
            console.log(" Saving... ", selectedIndex, updatedCompDef);
            setItems([...items]);

            onUpdate(items);
          }}>UPDATE</Button>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <div className="componentList">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable-list">
            {provided => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {items && items.map((componentDefinition: any, index: number) => (
                  <DraggableComponentItem
                    selected={selected && (selected.componentName + selected.name) === (componentDefinition.componentName + componentDefinition.name)}
                    componentDefinition={componentDefinition} index={index} key={index} onSelect={handleSelect}
                    onEditClick={() => {
                      const current = JSON.stringify(selected, null, 4);
                      setUpdatedCompDef(selected);
                      setCurrentCompDef(current);

                      setFieldName(selected.name);
                      setLabel(selected.label);
                      setFullWidth(selected.fullWidth);

                      setOpenDialog(true);
                    }}
                    onDeleteClick={() => {
                      setToDelete(index);
                    }} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </>);
};

export default DraggableComponentList;