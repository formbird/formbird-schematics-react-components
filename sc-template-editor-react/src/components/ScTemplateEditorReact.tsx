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
  const [components, setComponents] = useState([
// {
//     "label": "Application Id:",
//     "name": "applicationId",
//     "componentName": "sc-text-box",
//     "fullWidth": true
// },
// {
//     "label": "Tag Application Id:",
//     "name": "tagApplicationId",
//     "componentName": "sc-text-box",
//     "fullWidth": true
// },
// {
//     "label": "Branch Application Id:",
//     "name": "branchApplicationId",
//     "componentName": "sc-text-box",
//     "fullWidth": true
// },
// {
//     "name": "panelStyleAccount",
//     "componentName": "sc-static-html",
//     "html": "<style> .panel-account {background:#fffff;border:1px black;box-shadow: 10px 10px 5px grey;} .panel-account > .panel-heading {background:#6a99f4;color:white;font-size:1.25em;font-weight:200;padding:1px 1px 1px 10px} .control-label{color:#6a99f4 !important} .cww-icon {height:auto;width:150px;margin-left:10px;float:right}</style>",
//     "fullWidth": true
// },
// {
//     "name": "panelDetails",
//     "componentName": "sc-static-html",
//     "visible": true,
//     "label": "User Account",
//     "wrapClass": "panel-account",
//     "wrapHtmlType": "wrap",
//     "wrapAction": "open",
//     "fullWidth": true
// },
// {
//     "fullWidth": true,
//     "componentName": "sc-static-html",
//     "html": "<img src='/api/getFile/cww-reference-20-companyLogo1.png' class = 'cww-icon hidden-xs'</img>"
// },
// {
//     "name": "appTags",
//     "componentName": "sc-static-value",
//     "visible": false,
//     "value": [
//         "cww",
//         "system",
//         "account"
//     ]
// },
// {
//     "componentName": "sc-static-value",
//     "name": "provider",
//     "visible": false,
//     "value": "local"
// },
// {
//     "componentName": "sc-party",
//     "fullWidth": true,
//     "mandatoryFields": [
//         "firstName",
//         "surname"
//     ],
//     "detail": "",
//     "label": "Name",
//     "mandatory": true,
//     "name": "usersName"
// },
// {
//     "componentName": "sc-related-document",
//     "label": "Intray Name",
//     "mandatory": false,
//     "name": "intraysRel",
//     "singleSelection": true,
//     "filter": "{'query': {'bool':{'filter':[{'term':{'appTags':'cww'}},{'term':{'appTags':'resource'}},{'term':{'systemHeader.systemType':'document'}},{'term':{'status':'Active'}},{'term':{'type':'Intray'}}]}}}",
//     "trigger": {
//         "data": null,
//         "postSave": false
//     },
//     "relatedFields": {
//         "department": "department",
//         "group": "group",
//         "company": "company",
//         "team": "team"
//     },
//     "showDropDown": true,
//     "detail": "",
//     "visible": true,
//     "fullWidth": false
// },
// {
//     "componentName": "sc-email",
//     "name": "email",
//     "mandatory": true,
//     "label": "Email"
// },
// {
//     "componentName": "sc-static-html",
//     "HTML": " ",
//     "fullWidth": true
// },
// {
//     "componentName": "ft-password-entry",
//     "name": "password",
//     "label": "Enter or Change Password (password)",
//     "type": "Password"
// },
// {
//     "componentName": "sc-static-html",
//     "fullWidth": true,
//     "HTML": " "
// },
// {
//     "componentName": "sc-check-box",
//     "mandatory": false,
//     "label": "Verified",
//     "name": "verified"
// },
// {
//     "componentName": "sc-text-box",
//     "name": "defaultURL",
//     "label": "defaultURL",
//     "mandatory": true
// },
// {
//     "componentName": "sc-related-document",
//     "name": "securityGroupsRel",
//     "label": "Security Access Group",
//     "mandatory": true,
//     "fullWidth": true,
//     "disableLink": true,
//     "relatedFields": {
//         "rights": "rights"
//     },
//     "trigger": {
//         "data": null,
//         "postSave": false
//     },
//     "filter": "{'query':{'bool':{'filter':[{'term':{'appTags':'cww'}},{'term':{'appTags':'key'}},{'term':{'systemHeader.systemType':'document'}}]}}}",
//     "showDropDown": true
// },
// {
//     "componentName": "sc-drop-down",
//     "name": "accountRole",
//     "label": "Account Role",
//     "mandatory": true,
//     "detail": "",
//     "dropDownList": [
//         "WM User",
//         "WM Supervisor",
//         "WM CSE",
//         "WM Super User"
//     ]
// },
// {
//     "componentName": "sc-static-html",
//     "name": "panelDetails",
//     "fullWidth": true,
//     "wrapClass": "panel-account",
//     "wrapHtmlType": "wrap",
//     "wrapAction": "close"
// },
// {
//     "componentName": "ft-uploader",
//     "name": "uploadertest",
//     "label": "Upload (ft-uploader)"
// },
// {
//     "componentName": "sc-uploader",
//     "name": "uploadertestSC",
//     "label": "Upload (sc-uploader)"
// }
  ]);
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
