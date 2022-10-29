import React, { useState, useEffect } from 'react';
import {FormComponent, ComponentDefinition} from '@formbird/types';
import './banner-style.css';
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
    <div class='well well-sm' style={
      {
        fontWeight: componentDefinition.fontWeight || "bold", 
        background: componentDefinition.backgroundColor || '#1E90FF', 
        color: componentDefinition.fontColor || "white"
      }}
    >{componentDefinition.text}</div>
  );
};

// register the component as a custom element so it can be shown in formbird
convertToCustomElement('re-banner', ReBannerComponent);

export default ReBannerComponent;
