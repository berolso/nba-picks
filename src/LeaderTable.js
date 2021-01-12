import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
  table: {
    // width: '100%'
    minWidth: 650,
  },
});
const LeaderTable = ({ standings }) => {
  const classes = useStyles();

  const picks = {
    Dane: ["POR", "LAL", "MEM", "TOR", "SA", "OKC"],
    Nate: ["UTA", "LAC", "BOS", "HOU", "DET", "CLE"],
    Brett: ["BKN", "DAL", "PHI", "CHI", "CHA", "SAC"],
    Paul: ["MIL", "DEN", "WSH", "MIA", "NY", "MIN"],
    Derek: ["IND", "GS", "PHX", "ATL", "NO", "ORL"],
  };
  // const picks = {
  //   Dane: ["POR", "LAL", "MEM", "TOR", "SA/", "OKC"],
  //   Nate: ["UTA", "LAC", "BOS", "HOU", "DET", "CLE"],
  //   Brett: ["BKN", "DAL", "PHI", "CHI", "CHA", "SAC"],
  //   Paul: ["MIL", "DEN", "WSH", "MIA", "NY/", "MIN"],
  //   Derek: ["IND", "GS/", "PHX", "ATL", "NO/", "ORL"],
  // };

  function createData(name, wins, losses, played, vegProj, teams, winsPer) {
    return { name, wins, losses, played, vegProj, teams, winsPer };
  }

  const winTotals = (pickList) => {
    if (standings) {
      const objs = pickList.map((abr) => standings[abr].teamWins);
      // console.log(objs);
      return objs.reduce((acc, curr) => +acc + +curr);
    }
  };

  const lossTotals = (pickList) => {
    if (standings) {
      const objs = pickList.map((abr) => standings[abr].teamLosses);
      return objs.reduce((acc, curr) => +acc + +curr);
    }
  };

  const projWins = (pickList) => {
    if (standings) {
      const objs = pickList.map((abr) => standings[abr].projWins);
      return objs.reduce((acc, curr) => +acc + +curr);
    }
  };

  const getLogo = (team) => {
    if (standings) {
      return standings[team].teamLogo;
    }
  };

  const winsPer = (team) => {
    if (standings) {
      return standings[team].teamWins;
    }
  };

  const pointDif = (team) => {
    if (standings) {
      return standings[team].teamPtsDiff;
    }
  };

  // fill table rows
  const rows = Object.keys(picks).map((name) =>
    createData(
      name,
      winTotals(picks[name]),
      lossTotals(picks[name]),
      winTotals(picks[name]) + lossTotals(picks[name]),
      projWins(picks[name]),
      [
        picks[name].map((i) => (
          <a>
            <img style={{ width: "20px" }} src={getLogo(i)} />({winsPer(i)},{" "}
            <span style={{ color: pointDif(i) > 0 ? "green" : "red" }}>
              {pointDif(i)}
            </span>
            ){" "}
          </a>
        )),
      ]
    )
  );

  // sort rows
  // console.log("rows", rows);

  function compare(a, b) {
    // console.log('a',a,'b',b);
    if (a.wins < b.wins) {
      return 1;
    }
    if (a.wins > b.wins) {
      return -1;
    }
    return 0;
  }

  rows.sort(compare);
  // console.log("sort", rows);

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="right">Wins</TableCell>
            <TableCell align="right">Losses</TableCell>
            <TableCell align="right">Played</TableCell>
            <TableCell align="right">Vegas says</TableCell>
            <TableCell align="left">Teams(wins, point differential)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.wins}</TableCell>
              <TableCell align="right">{row.losses}</TableCell>
              <TableCell align="right">{row.played}</TableCell>
              <TableCell align="right">{row.vegProj}</TableCell>
              <TableCell align="left">{row.teams}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// const LeaderTable = () =>{
//   return(
//     <div>
//       <h2>Leaders</h2>
//     </div>
//   )
// }
export default LeaderTable;
