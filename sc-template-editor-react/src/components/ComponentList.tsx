import React, { useState } from 'react';
import {
    Draggable,
    DragDropContext,
    Droppable
  } from 'react-beautiful-dnd';
import { ListItem, ListItemAvatar, ListItemText, Avatar } from '@mui/material';
import { Inbox } from '@mui/icons-material';

const DraggableComponentItem = ({ componentDefinition, index, onSelect }: any) => {
  return (
    <Draggable draggableId={componentDefinition.componentName + index} index={index} key={componentDefinition.componentName + index}>
      {(provided, snapshot) => (
        <ListItem
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={snapshot.isDragging ? 'dragged' : ''}
          onClick={() => onSelect(componentDefinition) }
        >
        {componentDefinition.id}
          <ListItemAvatar>
            <Avatar>
              <Inbox />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={componentDefinition.name} secondary={componentDefinition.componentName} />
        </ListItem>
      )}
    </Draggable>
  );
};

const DraggableComponentList = ({ components, onDrag, onSelect}: any) => {

    const [items, setItems] = useState(components);
    const reorder = (list: any, startIndex: number,endIndex: number) => {
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

    return (<DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable-list">
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {components.map((componentDefinition: any, index: number) => (
                <DraggableComponentItem componentDefinition={componentDefinition} index={index} key={index} onSelect={onSelect}/>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>);
};

export default DraggableComponentList;