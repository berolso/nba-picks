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
const LeaderTable = ({ standings, teams, odds }) => {
  const classes = useStyles();

  const picks = {
    Dane: ["POR", "LAL", "MEM", "TOR", "SAS", "OKC"],
    Nate: ["UTA", "LAC", "BOS", "HOU", "DET", "CLE"],
    Brett: ["BKN", "DAL", "PHI", "CHI", "CHA", "SAC"],
    Paul: ["MIL", "DEN", "WAS", "MIA", "NYK", "MIN"],
    Derek: ["IND", "GSW", "PHX", "ATL", "NOP", "ORL"],
  };

  function createData(name, wins, losses, played, vegProj, teams) {
    return { name, wins, losses, played, vegProj, teams };
  }

  const teamWins = (team) => {
    if (teams.length) {
      const id = teams.find((t) => t.shortName === team).teamId;
      const wins = standings.find((t) => t.teamId === id).win;
      return wins
    }
  };

  const winTotals = (list) => {
    if (teams.length) {
      const teamIds = list.map(
        (abr) => teams.find((t) => t.shortName === abr).teamId
      );
      const wins = teamIds.map(
        (id) => standings.find((team) => team.teamId === id).win
      );
      return wins.reduce((acc, curr) => +acc + +curr);
    } else {
    }
  };

  const lossTotals = (list) => {
    if (teams.length) {
      const teamIds = list.map(
        (abr) => teams.find((t) => t.shortName === abr).teamId
      );
      const wins = teamIds.map(
        (id) => standings.find((team) => team.teamId === id).loss
      );
      return wins.reduce((acc, curr) => +acc + +curr);
    } else {
    }
  };

  const projWins = (list) =>{
    // get convert shortnames to fullnames from api
    if(teams.length){
      const fullNames = list.map(
        (abr) => teams.find((t) => t.shortName === abr).fullName
      ); 
      const proj = fullNames.map(
        (fullName) => odds[fullName] || 0
      );
      // console.log('compare',odds,fullNames);
      console.log(proj);
      // console.log('odds',odds);
      return proj.reduce((acc,curr) => +acc + +curr)
    }
  }

  const getLogo = (team) => {
    if (teams.length) {
      return teams.find((t) => t.shortName === team).logo;
    }
  };

  const rows = Object.keys(picks).map((name) =>
    createData(
      name,
      winTotals(picks[name]),
      lossTotals(picks[name]),
      winTotals(picks[name]) + lossTotals(picks[name]),
      projWins(picks[name]),
      [picks[name].map((i) => <a> <img style={{width: '20px'}} src={getLogo(i)}/>({teamWins(i)}) </a>)]
    )
  );

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
            <TableCell align="left">Teams(wins)</TableCell>
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
