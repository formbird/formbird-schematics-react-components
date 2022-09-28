import React, { useState, useEffect } from 'react';
import { convertToCustomElement } from '../utils/CustomElementWrapper';
import { changedDocumentService } from '../services'

const ReWorkInProgress = ({
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

  useEffect(() => {
    if (fieldValue) {
      setValue(fieldValue);
    } else if (componentDefinition.defaultValue) {
      setValue(componentDefinition.defaultValue);
    }
  }, []);

  return (
    <div>
      <p>re-work-in-progress works. Please edit src/components/ReWorkInProgress.tsx to make changes</p>
      <h3>Next Steps</h3>
      <ul>
        <li>
          <a className='md-button' target='_blank' href='https://www.formbird.com/docs/6.Component%20Development/6.1.NG%20Web%20Component%20Development/010-Creating_a_React_Component/#creating-a-production-build'>
            Build for Production
          </a>
        </li>
        <li>
          <a className='md-button' target='_blank' href='https://www.formbird.com/docs/6.Component%20Development/6.1.NG%20Web%20Component%20Development/010-Creating_a_React_Component/#tutorials'>
            Tutorials
          </a>
        </li>
        <li>
          <a className='md-button' target='_blank' href='https://www.formbird.com/docs/6.Component%20Development/6.1.NG%20Web%20Component%20Development/010-Creating_a_React_Component/#appendices'>
            Appendices
          </a>
        </li>
      </ul>
    </div>
  );
};

// register the component as a custom element so it can be shown in formbird
convertToCustomElement('re-work-in-progress', ReWorkInProgress);

export default ReWorkInProgress;
