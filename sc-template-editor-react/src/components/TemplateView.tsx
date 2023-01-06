import React from 'react';
import { useDrop } from 'react-dnd';

const TemplateView = ({templateRef}) => {
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: 'component',
        drop: () => ({ name: 'Components' }),
        collect: (monitor) => ({
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        }),
      }));
    
      const isActive = canDrop && isOver;
      let border = '1px dashed grey';
      if (isActive) {
        border = '1px solid grey';
      } else if (canDrop) {
        border = '1px dashed black';
      }

    return <>
      <div ref={drop} style={{ height: '100vh', border }}>
          <div ref={templateRef}></div>
      </div>
    </>;

}

export default TemplateView;