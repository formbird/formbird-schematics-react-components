import React, { useState, useEffect, useRef } from 'react';
import { convertToCustomElement } from '../utils/CustomElementWrapper';
import { changedDocumentService } from '../services'
import './index.css';
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
  const [tabValue, setTabValue] = useState(0);
  const templateRef = useRef(null);
  const [components, setComponents] = useState([]);

  const [error, setError] = useState('');

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

    const split = window.location.href.split('/');
    if (split.length === 6) {
      const id = split[4];
      fetch(`/api/document/${id}`).then(response => {
        response.json().then(json => {
          const fetchedComponents = json.components || [];

          if (json.systemHeader.systemType !== 'template') {
            setError('Not Template!');
          } else if (fetchedComponents.find(comp => comp.componentName === 'sc-template-editor-react')) {
            setError('Template Editor is not allowed!');
          } else {
            setComponents(fetchedComponents);
            setComponentsToView(fetchedComponents);
          }
        });
      });
    } else {
      setComponentsToView();
    }
  }, []);

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

    changedDocumentService.valueChanged({
      document,
      fieldName: 'components',
      fieldValue: components,
      formParameters,
      template,
      componentDefinition,
      key: compKey
    }, components);
  };

  return (
    <>{
      error ||
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
                <ComponentList components={components}
                  onDrag={(newComponents) => {
                    setComponents(newComponents);
                    setComponentsToView(newComponents);

                    changedDocumentService.valueChanged({
                      document,
                      fieldName: 'components',
                      fieldValue: newComponents,
                      formParameters,
                      template,
                      componentDefinition,
                      key: compKey
                    }, newComponents);
                  }}
                  onSelect={componentDefinition => {
                    broadcastService.broadcast('updateFormTemplate', { editorSelected: componentDefinition.name });
                  }}
                  onUpdate={(newComponents) => {
                    setComponents(newComponents);
                    setComponentsToView(newComponents);

                    changedDocumentService.valueChanged({
                      document,
                      fieldName: 'components',
                      fieldValue: newComponents,
                      formParameters,
                      template,
                      componentDefinition,
                      key: compKey
                    }, newComponents);
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
    }
    </>
  );
};

// register the component as a custom element so it can be shown in formbird
convertToCustomElement('sc-template-editor-react', ScTemplateEditorReact);

export default ScTemplateEditorReact;
