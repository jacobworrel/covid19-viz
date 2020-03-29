import {useEffect, useState} from 'react';
import axios from 'axios';
import csvToJson from 'csvtojson';

export function useFetchCSV (url) {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get(url).then(({data: csvStr}) => {
      csvToJson({
        noheader: true,
        output: 'csv',
      })
        .fromString(csvStr)
        .then(data => setData(data));
    });
  }, []);

  return data;
}