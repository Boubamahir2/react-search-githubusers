import React from "react";
import styled from "styled-components";
import { GithubContext } from "../context/context";
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";

const Repos = () => {
  const { githubRepos } = React.useContext(GithubContext);
  const languages = githubRepos.reduce((total, item) => {
    const { language, stargazers_count } = item;
    //if the language is null then just return the total
    if (!language) {
      return total;
    }
    if (!total[language]) {
      total[language] = { label: language, value: 1, stars: stargazers_count };
    } else {
      total[language] = {
        ...total[language],
        value: total[language].value + 1,
        stars: total[language].stars + stargazers_count,
      }; //this will dynamically return the number of languages in each repo
    }
    //

    return total;
  }, {});

  const chartData = [
    {
      label: "html",
      value: "23",
    },
    {
      label: "css",
      value: "18",
    },
    {
      label: "javascript",
      value: "80",
    },
  ];

  //sort based on languages
  //this functionality will create for us an array from the langauge object
  const mostUsed = Object.values(languages)
    //lets sort the hisghtest value and the first five
    .sort((a, b) => {
      return b.value - a.value;
    })
    .slice(0, 5);

  //sort based on stars
  const mostPopular = Object.values(mostUsed)
    .sort((a, b) => {
      return b.stars - a.stars;
    })
    .map((item) => {
      return { ...item, value: item.stars };
    })
    .slice(0, 5);

  //stars forks
  let { stars, forks } = githubRepos.reduce(
    (total, item) => {
      const { stargazers_count, name, forks } = item;
      total.stars[stargazers_count] = { label: name, value: stargazers_count };
      total.forks[forks] = { label: name, value: forks };
      return total;
    },
    {
      stars: {},
      forks: {},
    }
  );

  stars = Object.values(stars).slice(-5).reverse();
  forks = Object.values(forks).slice(-5).reverse();
  console.log(forks);

  return (
    <section className="section">
      <Wrapper className="section-center">
        <Pie3D data={mostUsed} />
        <Column3D data={stars} />
        <Doughnut2D data={mostPopular} />
        <Bar3D data={forks} />
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
