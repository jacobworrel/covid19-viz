import React from 'react';

export function Checkbox ({ id,  name, isChecked, onChange }) {
  return (
    <div className="checkbox">
      <input type="checkbox" id={id} name={name} checked={isChecked} onChange={onChange} />
      <label htmlFor={id}>{name}</label>
    </div>
  );
}