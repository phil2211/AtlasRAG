import React from 'react';
import AIWriter from 'react-aiwriter';
import Markdown from 'react-markdown';

const MemoizedAIWriter = React.memo(({ response }) => (
    <AIWriter>
      <Markdown>
        {response}
      </Markdown>
    </AIWriter>
  ));

  export default MemoizedAIWriter;