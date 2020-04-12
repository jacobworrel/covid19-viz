import React from 'react';
import styled from 'styled-components';

export function Tab ({ id, name, selectedMetric, onClick }) {
  return (
    <Wrapper
      onClick={onClick}
      selectedMetric={selectedMetric}
      id={id}
      className="l-center"
    >
      {name}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  color: ${({ selectedMetric, id}) => selectedMetric === id ? 'white' : 'black'};
  background-color: ${({ selectedMetric, id}) => selectedMetric === id ? 'dodgerblue' : '#E2E2E2'};
  cursor: pointer;
  width: 150px;
  height: 40px;
`;
