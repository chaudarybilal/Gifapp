import React, { useEffect, useState } from "react";
import { FaCheckSquare, FaRegTrashAlt } from "react-icons/fa";
import "./Giff.css";

const Giff = () => {
  const getLocalItem = () => {
    let list = localStorage.getItem("lists");
    if (list) {
      return JSON.parse(localStorage.getItem("lists"));
    } else {
      return [];
    }
  };
  const [search, setSearch] = useState("");
  const [gifs, setGifs] = useState(getLocalItem());
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(100);
  const [visible, setVisible] = useState(100);
  const [data, saveData] = useState([gifs]);

  const lmt = 10;
  const apikey = "G67CqXGOL4aPuxBdHv4P1d7PGXc4RTNy";
  var search_url =
    "https://api.giphy.com/v1/gifs/search?q=" +
    search +
    "&key=" +
    apikey +
    "&limit=" +
    lmt +
    "&offset=" +
    offset;

  const onClickhandler = () => {
    console.log("search_url", search_url);
    if (search.length > 0) {
      setLoading(true);

      fetch(search_url)
        .then((response) => {
          setLoading(false);
          return response.json();
        })

        .then((res) => {
          console.log("res", res);
          setGifs([...gifs, ...res.data]);
        })
        .catch((e) => {
          console.log("error", e);
          setLoading(false);
        });
    }
  };
  const savefun = () => {
    saveData((olditem) => {
      return [...olditem, data];
    });
  };

  useEffect(() => {
    onClickhandler();
  }, [offset]);

  useEffect(() => {
    localStorage.setItem("lists", JSON.stringify(gifs));
  }, [gifs]);

  return (
    <>
      <div className="title">
        <h1>giphy search engine</h1>
      </div>
      <div className="header">
        <div className="search-bar">
          <input
            type="text"
            placeholder="ENTER TEXT HERE"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn" onClick={onClickhandler}>
          SEARCH HERE
        </button>
      </div>
      <div className="result">
        {loading ? (
          <div className="loading">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="list">
            {gifs.slice(0, visible).map((gif, index) => {
              return (
                <div key={index} id={index} className="gif-sec">
                  <div className="add">
                    <img
                      width="10px"
                      height="200px"
                      src={gif.images.downsized?.url}
                      alt=""
                    />

                    <FaCheckSquare onSelect={savefun} />

                    <FaRegTrashAlt />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div>
          <button
            className="btn-2"
            onClick={(prevValue) => {
              setOffset(prevValue + 10);
            }}
          >
            {/* Load More NEXT PAGE {offset} To {lmt + offset} */}
          </button>
        </div>
        <div>
          <button
            className="btn-3"
            onClick={() => {
              setVisible((prevValue) => prevValue - 10);
            }}
          >
            PREVIOUS PAGE
          </button>
        </div>
      </div>
    </>
  );
};
export default Giff;
