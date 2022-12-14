import React, { useState, useEffect, useRef } from 'react';
import { convertToCustomElement } from '../utils/CustomElementWrapper';
import { changedDocumentService } from '../services'
import './index.css';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import ComponentList from './ComponentList';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TemplateView from './TemplateView';
import ComponentWidgets from './ComponentWidgets';

const anyWindow: any = window;
const unsavedDocumentService = anyWindow.FormbirdServiceInjector.get('UnsavedDocumentService');
const broadcastService = anyWindow.FormbirdServiceInjector.get('BroadcastService');

const ScTemplateEditorReact = ({
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
  const [treeData, setTreeData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const templateRef = useRef(null);
  const [components, setComponents] = useState([]);
  const [open, setOpen] = React.useState(false);

  const setComponentsToView = (newComponents?) => {
    templateRef.current.innerHTML = '';
    const customElement: any = window.document.createElement('ft-formbird-template');
    customElement.formParameters = {
      templateEditor: true,
      components: newComponents || components,
      parentDocumentId: '387406E0-DF27-4566-A075-CEA76BD02040',
      selectedDocumentId: '387406E0-DF27-4566-A075-CEA76BD02040',
      unsavedDocumentListId: unsavedDocumentService.createUnsavedDocumentList()
    };

    customElement.isMainDocument = false;
    customElement.formGroup = {};
    customElement.defaultFields = {};

    templateRef.current.appendChild(customElement);
  };

  useEffect(() => {
    if (fieldValue) {
      setValue(fieldValue);
    } else if (componentDefinition.defaultValue) {
      setValue(componentDefinition.defaultValue);
    }

    setComponentsToView();
  }, []);


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDrop = (item) => {
    const compDef = {
      ...item.componentDefinition,
      "componentName": item.name,
      'name': 'name' + components.length,
      'label': 'test' + components.length
    };

    components.push(compDef);

    if (item.additionalComponentDefinition) {
      const compDef2 = {
        ...item.additionalComponentDefinition,
        "componentName": item.name,
        'name': compDef.name,
        'label': compDef.label
      };

      components.push(compDef2);
    }

    setComponents(components);
    setComponentsToView(components);
  };

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <div className="container">
          <div className="item-0">
            <Tabs value={tabValue} onChange={(event, newTabValue) => {
              setTabValue(newTabValue);
            }}>
              <Tab label="Widgets" />
              <Tab label="Components" />
            </Tabs>
            {
              tabValue === 0 &&
              <ComponentWidgets onDrop={handleDrop} />
            }
            {
              tabValue === 1 &&
              <>
                <Button variant="text">Edit</Button>
                <Button variant="text">Remove</Button>
                <ComponentList components={components}
                  onDrag={(newComponents) => {
                    console.log(newComponents);
                    setComponents(newComponents);
                    setComponentsToView(newComponents);
                  }}
                  onSelect={componentDefinition => {
                    broadcastService.broadcast('editorSelected', componentDefinition.name);
                  }}
                />
              </>
            }
          </div>
          <div className="item-1 editor-view">
            <TemplateView templateRef={templateRef} />
          </div>
        </div>
      </DndProvider>
    </>
  );
};

// register the component as a custom element so it can be shown in formbird
convertToCustomElement('sc-template-editor-react', ScTemplateEditorReact);

export default ScTemplateEditorReact;
