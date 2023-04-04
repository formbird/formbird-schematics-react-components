
import React, { useState, useEffect, useRef } from 'react';
import type { CSSProperties, FC } from 'react';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@mui/material';
import { useDrag } from 'react-dnd';
import { createSvgIcon } from '@mui/material/utils';
import {
  Inbox,
  CalendarMonth,
  DriveFileRenameOutline,
  Html,
  Subtitles,
  CheckBox
} from '@mui/icons-material';

const anyWindow: any = window;
const searchService = anyWindow.FormbirdServiceInjector.get('SearchService');

const components = [
  {
    name: 'sc-text-box',
    icon: DriveFileRenameOutline,
    componentDefinition: {}
  },
  {
    name: 'sc-date-time',
    icon: CalendarMonth,
    componentDefinition: {}
  },
  {
    name: 'sc-check-box',
    icon: CheckBox,
    componentDefinition: {}
  },
  {
    name: 'sc-static-html',
    icon: Html,
    componentDefinition: {
      html: '<p>static html</p>'
    }
  },
  {
    name: "sc-note-box",
    componentDefintion: {
      "componentName": "sc-note-box",
      "fullWidth": true,
      "label": "Report Description",
      "name": "headingText",
      "noteBoxRows": 1,
      "defaultValue": "Number of Bursts and Leaks by priority",
      "enabled": false
    }
  },
  {
    name: "sc-drop-down",
    componentDefinition: {
      "componentName": "sc-drop-down",
      "fullWidth": false,
      "label": "Pre-Set Times",
      "name": "reportTime",
      "mandatory": false,
      "dropDownList": [
        "Current Month To Date",
        "Previous Months",
        "Yesterday",
        "Last Week",
        "Last Month",
        "Last Calendar Year",
        "Last 7 Days",
        "Current Financial Year To Date",
        "Previous Financial Year",
        "Last (rolling) 12 months"
      ],
      "detail": "",
      "disableSave": true
    }
  }, {
    "name": "sc-numeric",
    componentDefinition: {
      "componentName": "sc-numeric",
      "label": "Fiscal Year",
      "name": "fiscalYearSelector",
      "integerValueOnly": true,
      "min": 2018,
      "disableSave": true
    }
  },
  {
    name: 'sc-static-html',
    secondary: 'wrapped',
    icon: Subtitles,
    componentDefinition: {
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
  },
  {
    name: "sc-button",
    componentDefintion: {
      "name": "cmdRunReport",
      "componentName": "sc-button",
      "label": " ",
      "btnLabel": "Run Report",
      "caption": "Run Report",
      "style": "btn-link btnB",
      "fullWidth": true
    }
  },
  {
    name: 'sc-panel-collapse',
    componentDefinition: {
      "componentName": "sc-panel-collapse",
      "fullWidth": true,
      "wrapAction": "open",
      "wrapHtmlType": "wrap",
      "wrapClass": "panel-report",
      "visible": true,
      "label": "Contracted Performance Targets",
      "wrapPanelCollapsed": true
    },
    additionalComponentDefinition: {
      "componentName": "sc-panel-collapse",
      "fullWidth": true,
      "wrapAction": "close",
      "wrapHtmlType": "wrap",
      "wrapClass": "panel-report"
    }
  }
];

const SvgIcon = (path) => createSvgIcon(
  <path d={path} />,
  'Home'
);

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
      <ListItemText primary={name} secondary={item.secondary} />
    </ListItem>
  )
}

const ComponentWidgets = ({ onDrop }) => {

  // const [components, setComponents] = useState([]);

  // useEffect(() => {
  //   const options = {
  //     filter: {
  //       "query": {
  //         "bool": {
  //           "must": [
  //             {
  //               "term": {
  //                 "systemHeader.systemType": "component"
  //               }
  //             }
  //           ]
  //         }
  //       }
  //     },
  //     sort: { "name": { "order": "asc" } }
  //   };

  //   searchService.search(options).then(result => {
  //     const componentResults = result.data.hits.hits.map(res => res._source);
  //     const compWidgets = [];
  //     for (const comp of componentResults) {
  //       if (comp.name) {
  //         compWidgets.push({
  //           name: comp.name,
  //           componentDefinition: {
  //             componentName: comp.name,
  //             ...comp.componentDefinition
  //           },
  //           additionalComponentDefinition: comp.additionalComponentDefinition,
  //           icon: SvgIcon(comp.svgIcon || 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z')
  //         });
  //       }
  //     }

  //     setComponents(compWidgets);
  //   });
  // }, []);

  return (
    <List className='componentList'>
      {
        components.map(item => <DraggableComponent name={item.name} item={item} onDrop={onDrop} />)
      }
    </List>)
};

export default ComponentWidgets;