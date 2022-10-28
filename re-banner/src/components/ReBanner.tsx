import React, { useState, useEffect } from 'react';
import {FormComponent, ComponentDefinition} from '@formbird/types';
import { convertToCustomElement } from '../utils/CustomElementWrapper';

interface ReBannerComponentDefinition extends ComponentDefinition {
  text: string;
}

const ReBannerComponent = ({
  document,
  fieldValue,
  template,
  fieldName,
  formParameters,
  key,
  responsiveLayouts,
  message,
  componentDefinition
}) => {

  const [value, setValue] = useState();

  useEffect(() => {
    if (fieldValue) {
      setValue(fieldValue);
    } else if (componentDefinition.defaultValue) {
      setValue(componentDefinition.defaultValue);
    }
  }, []);

  return (
    <table 
    style={{borderCollapse: "separate", borderSpacing: "10px 0px"}} 
    >
     <tbody>
      <tr>
        <th 
        style={{"textAlign": "left"}}
        >
          <img src='/images/formbird-logo-small.png' />
        </th>
        <th 
        style={{"textAlign": "left"}}
        >
          <div 
          style={{"color":"DimGray", "fontWeight":"bold", "fontSize":"1.5em"}}
          >{componentDefinition.text}</div>
        </th>
      </tr>
      </tbody> 
    </table> 
  );
};

// register the component as a custom element so it can be shown in formbird
convertToCustomElement('re-banner', ReBannerComponent);

export default ReBannerComponent;
