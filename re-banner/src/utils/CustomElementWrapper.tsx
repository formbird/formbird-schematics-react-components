import React, { useState, Fragment } from 'react';
import ReactDOM from 'react-dom';
import { ComponentDefinition, FormComponent, FormDocument, FormTemplate } from '@formbird/types';

export const convertToCustomElement = (name: string, Component: any) => {
  class FtWrapper extends HTMLElement implements FormComponent {
    document: FormDocument;
    template: FormTemplate;
    fieldValue: any;
    fieldName: string;
    formParameters: any;
    key: number;
    message: string;
    responsiveLayouts: string;
    componentDefinition: any;

    mountPoint: any;

    connectedCallback() {
      let componentProps = {};

      this.mountPoint = document.createElement('div');
      this.appendChild(this.mountPoint);

      if (!this.fieldValue && this.componentDefinition.defaultValue) {
        this.fieldValue = this.componentDefinition.defaultValue;
      }

      if (this.componentDefinition.componentProps) {
         componentProps = { 
          template: this.template,
          document: this.document
        };
      }

      ReactDOM.render(
        <Component {...{
            document: this.document,
            fieldValue: this.fieldValue,
            template: this.template,
            fieldName: this.fieldName,
            formParameters: this.formParameters,
            key: this.key,
            responsiveLayout: this.responsiveLayouts,
            message: this.message,
            componentDefinition: this.componentDefinition,
            componentProps
          }}
        />,
        this.mountPoint
      );
    }
  }

  customElements.define(name, FtWrapper);
};
