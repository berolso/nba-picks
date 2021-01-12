import React, { useState, useEffect } from "react";
import auctionScreenShot from "./auctionScreenShot.png";
import teamScreenShot from "./teamScreenShot.png";
import axios from "axios";

import LeaderTable from "./LeaderTable";

import "./App.css";

function App() {
  const [standings, setStandings] = useState([]);
  const [teams, setTeams] = useState([]);
  const [odds, setOdds] = useState({});

  let standingsRequest = {
    method: "GET",
    url: "https://api-nba-v1.p.rapidapi.com/standings/standard/2020",
    headers: {
      "x-rapidapi-key": "be4d399ec7msh0ccc4caeb34bc22p17f302jsnd4b055a79e7a",
      "x-rapidapi-host": "api-nba-v1.p.rapidapi.com",
    },
  };

  var teamsRequest = {
    method: "GET",
    url: "https://api-nba-v1.p.rapidapi.com/teams/league/standard",
    headers: {
      "x-rapidapi-key": "be4d399ec7msh0ccc4caeb34bc22p17f302jsnd4b055a79e7a",
      "x-rapidapi-host": "api-nba-v1.p.rapidapi.com",
    },
  };

  
  useEffect(() => {
      if(false){
        console.log('CALLED');
        const getStandings = async () => {
            const res = await axios(standingsRequest);
            setStandings(res.data.api.standings)
          };
          getStandings();
        }
        }, []);
        
  if (standings.length) {
  localStorage.setItem("standings", JSON.stringify(standings));
  }

  // useEffect(() => {
  //   const getTeams = async () => {
  //     const res = await axios(teamsRequest);
  //     console.log("teamRes", res);
  //     // correct name
  //     res.data.api.teams[15].fullName = "Los Angeles Clippers";
  //     setTeams(res.data.api.teams);
  //   };
  //   getTeams();
  // }, []);

  // if (teams.length) {
  //   console.log(true);
  // localStorage.setItem("teams", JSON.stringify(teams));
  // }

  useEffect(() => {
    const getStorage = async () => {
      setStandings(JSON.parse(localStorage.getItem("standings")));
      setTeams(JSON.parse(localStorage.getItem("teams")));
    };
    getStorage();
  }, []);

  // console.log("standings", standings);
  // console.log("teams", teams);

  useEffect(() => {
    // get request to odds site
    const getOdds = async () => {
      const res = await axios.get(
        // "https://cors-anywhere.herokuapp.com/..
        "https://www.thelines.com/betting/nba/win-totals/"
      );

      // create {team: wins} object
      var el = document.createElement("html");
      el.innerHTML = res.data;
      const elementList = el.getElementsByClassName("team-full-name");
      const teamsTable = {}

      for (var i = 0; i < elementList.length; i++) {
        let key = elementList[i].innerText.trim()
        key = key.replace('LA','Los Angeles')
      
        let value = elementList[i].parentNode.parentNode.parentNode.parentNode.lastChild.lastChild.lastChild.innerText
        teamsTable[key] = value
      }
      setOdds(teamsTable);
    };
    getOdds();
  }, []);

  // useEffect(() => {
  //   // get request to odds site
  //   const getOdds = async () => {
  //     const res = await axios.get(
  //       // "https://cors-anywhere.herokuapp.com/..
  //       "https://www.vegasinsider.com/nba/odds/win-totals/"
  //     );

  //     // select desired odds table by matching textContent with tag
  //     var el = document.createElement("html");
  //     el.innerHTML = res.data;
  //     const tagList = el.getElementsByTagName("td");
  //     const searchText = "2020-21 NBA Win Totals (Ascending Order)";
  //     let found;
  //     for (var i = 0; i < tagList.length; i++) {
  //       if (tagList[i].textContent === searchText) {
  //         found = tagList[i].parentElement.parentElement;
  //         break;
  //       }
  //     }
  //     // generate odds object
  //     const oddsList = found.getElementsByTagName("tbody")[0].children;
  //     const tuples = [...oddsList].map((i) => [
  //       i.children[0].innerText.trim(),
  //       i.children[1].innerText,
  //     ]);
  //     const oddsObject = Object.fromEntries(tuples);

  //     setOdds(oddsObject);
  //   };
  //   getOdds();
  // }, []);


  return (
    <div className="App">
      <h2>Score Board</h2>
      {/* <ul> */}
      <LeaderTable standings={standings} teams={teams} odds={odds} />
      {/* {standings.map((i, ind) => (
        <div key={ind}>
          {ind + 1} - {teams[i.teamId - 1].nickname} Wins:{i.win}
        </div>
      ))} */}
      <h3>Draft Day Ledger</h3>
      <img style={{ width: "98%" }} src={teamScreenShot} alt="table" />
      <img style={{ width: "98%" }} src={auctionScreenShot} alt="table" />
      {/* </ul> */}
    </div>
  );
}

export default App;
