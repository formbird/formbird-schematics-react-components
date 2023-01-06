
import React, { useState, useEffect, useRef } from 'react';
import type { CSSProperties, FC } from 'react';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@mui/material';
import { useDrag } from 'react-dnd';
import { 
    Inbox,
    CalendarMonth,
    DriveFileRenameOutline,
    Html,
    Subtitles,
    CheckBox
} from '@mui/icons-material';

const components = [
    {
        name: 'sc-text-box',
        icon: DriveFileRenameOutline,
        componentDefinition : {}
    },
    {
        name: 'sc-date-time',
        icon: CalendarMonth,
        componentDefinition : {}
    },
    {
        name: 'sc-check-box',
        icon: CheckBox,
        componentDefinition : {}
    },
    {
        name: 'sc-static-html',
        icon: Html,
        componentDefinition : {
            html: '<p>static html</p>'
        }
    },
    {
        name: 'sc-static-html',
        secondary: 'wrapped',
        icon: Subtitles,
        componentDefinition : {
          fullWidth: true,
          wrapClass: "panel-account",
          wrapHtmlType: "wrap",
          wrapAction: "open"
        },
        additionalComponentDefinition: {
          fullWidth: true,
          wrapClass: "panel-account",
          wrapHtmlType: "wrap",
          wrapAction: "close"
        }
    }
];


export interface DraggableComponentProps {
    name: string;
    onDrop: any;
    item?: any;
  }
  
  interface DropResult {
    name: string;
  }
  
  export const DraggableComponent: FC<DraggableComponentProps> = ({ name, onDrop, item }) => {
    let Icon = item.icon ? item.icon : Inbox; 
  
    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'component',
      item: item,
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult<DropResult>()
        if (item && dropResult) {
          onDrop(item);
        }
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
        handlerId: monitor.getHandlerId(),
      }),
    }))
  
    const opacity = isDragging ? 0.4 : 1;
    return (
      <ListItem ref={drag} style={{ opacity, fontSize: 12 }} data-testid={`box`}>
        <ListItemAvatar>
              <Avatar>
                <Icon />
              </Avatar>
            </ListItemAvatar>
        <ListItemText primary={name} secondary={item.secondary}/>
      </ListItem>
    )
  }

const ComponentWidgets = ({onDrop}) => {
    return (
        <List>
            {
                components.map(item => <DraggableComponent name={item.name} item={item} onDrop={onDrop}/>)
            }
        </List>)
};

export default ComponentWidgets;