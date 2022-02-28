import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";
// 'https://api.github.com/users/user'; to search for github repo

const GithubContext = React.createContext();
//remember the use context return two components,provider & consumer

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [githubRepos, setGithubRepos] = useState(mockRepos);
  const [githubfollowers, setGithubfollowers] = useState(mockFollowers);
  const [request, setRequest] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ show: false, msg: "" });

  //const search github user
  const searchGithubUser = async (user) => {
    toggleError();
    setLoading(true);
    //lets path the user to our url
    const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
      console.log(err)
    );

    if (response) {
      setGithubUser(response.data);

      // //repos
      const { login, followers_url } = response.data;
      // axios(`${rootUrl}/users/${login}/repos?per_page=100`).then((respone) =>
      //   setGithubRepos(respone.data)
      // );
      // //followers
      // axios(`${followers_url}?per_page=100`).then((respone) =>
      //   setGithubfollowers(respone.data)
      // );

      //here we only want to show the result only when every request is fullfilled
      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios(`${followers_url}?per_page=100`),
      ])
        .then((results) => {
          console.log(results); //this return two arrays
          const [repos, followers] = results;
          if (repos.status === "fulfilled") {
            setGithubRepos(repos.value.data);
          }
          if (followers.status === "fulfilled") {
            setGithubfollowers(followers.value.data);
          }
        })
        .catch((err) => console.log(err));
    } else {
      toggleError(true, "there is no user with such username");
    }
    chequeRequest();
    setLoading(false);
  };

  //checque request
  const chequeRequest = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data;
        setRequest(remaining);
        if (remaining === 0) {
          toggleError(true, "sorry you have exceeded your hourly rate limit");
        }
      })
      .catch((error) => console.log(error));
  };

  function toggleError(show = false, msg = "") {
    setError({ show: show, msg: msg });
  }

  useEffect(chequeRequest, []);

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        githubRepos,
        githubfollowers,
        request,
        error,
        searchGithubUser,
        loading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubProvider, GithubContext };
