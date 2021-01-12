import React, { useState, useEffect } from "react";
import auctionScreenShot from "./auctionScreenShot.png";
import teamScreenShot from "./teamScreenShot.png";
import axios from "axios";

import LeaderTable from "./LeaderTable";

import "./App.css";

function App() {
  // standings = {team: {logoUrl,wins,gamesPlayed,},...}
  const [standings, setStandings] = useState(null);

  // odds = {team: projWins,...}
  const [odds, setOdds] = useState({});

  // get standings from espn
  useEffect(() => {
    const getStandings = async () => {
      const res = await axios(
        "https://cors-anywhere.herokuapp.com/https://www.espn.com/nba/standings/_/group/league"
      );
      // create html element copy from response data
      var el = document.createElement("html");
      el.innerHTML = res.data;

      // select table from espn standings table
      const highestCommonElement = el.querySelector("Table").parentNode;
      // get columns
      const teamColumRows = highestCommonElement.querySelector("tbody")
        .children;
      const statsColumsRows = highestCommonElement.lastChild.querySelector(
        "tbody"
      ).children;

      // create {team: wins} object to store and organize data
      const teamsData = {};

      // loop through rows and grab wanted data
      for (let i = 0; i < teamColumRows.length; i++) {
        const teamURL = teamColumRows[i].querySelector("a").href;
        const teamABR = teamURL
          .slice(teamURL.indexOf("name/") + 5)
          .slice(0, 3)
          .toUpperCase()
          .replace("/", "");

        const teamName = teamColumRows[i].querySelector("img").title;
        const teamLogo = `https://a.espncdn.com/combiner/i?img=/i/teamlogos/nba/500/scoreboard/${
          teamABR === "UTA" ? "utah" : teamABR
        }.png&h=40&w=40`;
        const teamWins = statsColumsRows[i].children[0].innerText;
        const teamLosses = statsColumsRows[i].children[1].innerText;
        const teamPlayed = teamWins + teamLosses;
        const teamPtsDiff = statsColumsRows[i].children[10].innerText;

        // add data to object
        teamsData[teamABR] = {
          teamName,
          teamLogo,
          teamWins,
          teamLosses,
          teamPlayed,
          teamPtsDiff,
        };
      }

      setStandings(teamsData);
    };
    getStandings();
  }, []);

  if (standings && odds) {
    console.log("standings", standings);
    console.log("odds", odds);
  }

  useEffect(() => {
    // get projected wins from gambling site
    const getOdds = async () => {
      const res = await axios.get(
        "https://cors-anywhere.herokuapp.com/https://www.thelines.com/betting/nba/win-totals/"
      );

      // create {team: wins} object
      var el = document.createElement("html");
      el.innerHTML = res.data;
      const elementList = el.getElementsByClassName("team-full-name");
      const teamsTable = {};

      for (var i = 0; i < elementList.length; i++) {
        let key = elementList[i].innerText.trim();
        key = key.replace("LA Lakers", "Los Angeles Lakers");
        let value =
          elementList[i].parentNode.parentNode.parentNode.parentNode.lastChild
            .lastChild.lastChild.innerText;

        teamsTable[key] = value;
      }
      setOdds(teamsTable);
    };
    getOdds();
  }, []);

  // add odds to standings table
  if (standings) {
    for (let teamValues of Object.values(standings)) {
      teamValues.projWins = odds[teamValues.teamName];
    }
  }

  return (
    <div className="App">
      <h2>Score Board</h2>
      <LeaderTable standings={standings} teams={["hi", "hi"]} odds={odds} />
      <h3>Draft Day Ledger</h3>
      <img style={{ width: "98%" }} src={teamScreenShot} alt="table" />
      <img style={{ width: "98%" }} src={auctionScreenShot} alt="table" />
      {/* </ul> */}
    </div>
  );
}

export default App;
