import Select from 'react-select';
import * as R from 'ramda';
import React from 'react';

export function MultiSelect ({
  value,
  placeholder,
  onChange,
  options,
}) {
  return (
    <div style={{ width: selectWidth, marginLeft: widgetMarginLeft }}>
      <Select
        options={options}
        isMulti
        onChange={R.pipe(
          R.defaultTo([]),
          x => onChange(x)
        )}
        placeholder={placeholder}
        value={value}
      />
    </div>
  );
}

const selectWidth = 250;
const widgetMarginLeft = 30;