// ToggleButton.js

import styled from 'styled-components';

export const ToggleButton = styled.button`
  background-color: ${(props) => props.theme.body};
  color: ${(props) => props.theme.text};
  border: 2px solid ${(props) => props.theme.toggleBorder};
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, border 0.3s;

  &:hover {
    background-color: ${(props) => (props.theme === 'light' ? '#333' : '#FFF')};
    color: ${(props) => (props.theme === 'light' ? '#FFF' : '#333')};
  }
`;
