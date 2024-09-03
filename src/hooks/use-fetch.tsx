import { useEffect, useReducer, useRef } from "react";
// //**
// @param {string} url - fetch link

// */
function useFetch(url) {
  const cache = useRef({});

  // Used to prevent state update if the component is unmounted
  const cancelRequest = useRef(false);

  const initialState = {
    error: null,
    data: null,
    loading: false,
  };

  const fetchReducer = (state, action) => {
    switch (action.type) {
      case "fetching":
        return { ...initialState, loading: true };
      case "fetched":
        return { ...initialState, data: action.payload, laoding: false };
      case "error":
        return { ...initialState, error: action.payload, loading: false };
      default:
        return state;
    }
  };
  // console.log("here");

  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    // console.log('running')
    if (!url) return;

    cancelRequest.current = false;

    const fetchUrl = async () => {
      dispatch({ type: "fetching" });

      // check cache first
      if (cache.current[url]) {
        dispatch({ type: "fetched", payload: cache.current[url] });
        return;
      }
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "ORIGIN",
          "Access-Control-Allow-Headers": "*",
          mode: "cors",
        },
      };
    // `https://cors-anywhere.herokuapp.com/${url}`
    //https://cors-proxy.fringe.zone/
      await fetch(`https://api.allorigins.win/raw?url=${url}`, options)
        .then((res) => {
          if (!res.ok) {
            // console.log(res);
            throw new Error(res.statusText);
          } else return res.json();
        })
        .then((data) => {
          cache.current[url] = data;
          console.log(cache.current[url]);
          if (cancelRequest.current) return;

          dispatch({ type: "fetched", payload: data });
        })
        .catch((error) => {
          if (cancelRequest.current) return;

          dispatch({ type: "error", payload: error });
        });
    };

    fetchUrl();

    // cleanup
    return () => {
      cancelRequest.current = true;
    };
  }, [url]);

  return state;
}

export default useFetch;