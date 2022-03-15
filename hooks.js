// repo place for cool reusable react hooks 

// Good for async code in useEffect 
import { useRef, useEffect, useCallback } from 'react';

export default function useIsMounted(): () => boolean {
  const ref = useRef(false);

  useEffect(() => {
    ref.current = true;
    return () => {
      ref.current = false;
    };
  }, []);

  return useCallback(() => ref.current, [ref]);
}


// example 
import React, { useState, useEffect } from 'react';
import useIsMounted from './useIsMounted';
import axios from 'axios';
import Loading from './loading';
import Result from './result';

const FetchComponent = () => {
  const isMounted = useIsMounted();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        'http://hn.algolia.com/api/v1/search?query=redux'
      );
      if (isMounted()) {
        setData(result.data);
      }
    };

    fetchData();
  }, [isMounted]);

  return data ? <Result data={data} /> : <Loading />;
};

export default FetchComponent;

// need to research more - react tam should really have an official way to do this ...
// https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html 
// https://medium.com/@shanplourde/avoid-react-state-update-warnings-on-unmounted-components-bcecf054e953 



// hooks/useStateWithSessionStorage.ts

import { Dispatch, SetStateAction, useEffect, useState } from "react";

type ReturnType = [string, Dispatch<SetStateAction<string>>];

export default function useStateWithSessionStorage(
  storageKey: string // Needs to be unique
): ReturnType {
  const [value, setValue] = useState(sessionStorage.getItem(storageKey) ?? "");

  useEffect(() => {
    sessionStorage.setItem(storageKey, value);
  }, [value, storageKey]);

  return [value, setValue];
}
https://www.dolthub.com/blog/2021-12-15-client-side-storage-with-react/
