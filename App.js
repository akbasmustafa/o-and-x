import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Switch,
  Button,
  ImageBackground,
} from "react-native";

import { Cell } from "./components/Elements";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      game: [
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ],
      turn: "X",
      winner: null,
      status: "START", // "END", "RUNNING"
    };
  }

  handleCellPress(row, col) {
    if (this.state.status == "END") {
      return;
    }
    let { game, turn } = this.state;

    if (this.state.status == "START") {
      this.setState({ status: "RUNNING" });
    }

    if (game[row][col] !== null) {
      throw new Error("invalid move");
    }

    // TODO: some horrible immutable syntax
    game[row][col] = turn;

    // TODO: magic square algorithm
    const rowSame = (row) =>
      game[row][0] !== null && game[row].every((v) => v == game[row][0]);
    const colSame = (col) => {
      const f = game[0][col];
      return f !== null && game[1][col] == f && game[2][col] == f;
    };
    const diagDownSame = () => {
      const f = game[0][0];
      return f !== null && game[1][1] == f && game[2][2] == f;
    };
    const diagUpSame = () => {
      const f = game[0][2];
      return f !== null && game[1][1] == f && game[2][0] == f;
    };

    const winner =
      rowSame(0) ||
      rowSame(1) ||
      rowSame(2) ||
      colSame(0) ||
      colSame(1) ||
      colSame(2) ||
      diagDownSame() ||
      diagUpSame()
        ? turn
        : null;

    if (winner !== null) {
      this.setState({
        status: "END",
      });
    }

    this.setState({
      game,
      turn: turn == "X" ? "O" : "X",
      winner,
    });
  }

  toggleSwitch() {
    this.setState({ turn: this.state.turn == "X" ? "O" : "X" });
  }
  handleRestart() {
    this.setState({
      game: [
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ],
      turn: "X",
      winner: null,
      status: "START", // "END", "RUNNING"
    });
  }

  render() {
    const { game, turn, winner } = this.state;
    if (__DEV__) console.log(JSON.stringify(game));
    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
            minHeight: 30,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>Current Player: {turn}</Text>
          {this.state.status == "START" ? (
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={turn === "X" ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={this.toggleSwitch.bind(this)}
              value={turn === "X" ? true : false}
            />
          ) : null}
        </View>
        <View style={styles.body}>
          <ImageBackground
            source={require("./assets/background.png")}
            style={styles.image}
          >
            {game.map((rowValues, row) => {
              return (
                <View
                  key={`${row}`}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  {rowValues.map((cellValue, col) => {
                    return (
                      <Cell
                        key={`${row}-${col}`}
                        value={cellValue}
                        onPress={this.handleCellPress.bind(this, row, col)}
                      />
                    );
                  })}
                </View>
              );
            })}
          </ImageBackground>
        </View>
        <View style={styles.header}>
          <Button
            title="Restart"
            onPress={this.handleRestart.bind(this)}
          ></Button>
          {winner && (
            <Text style={{ fontWeight: "bold", margin: 5 }}>
              Winner is {winner}
            </Text>
          )}
        </View>
      </View>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    margin: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    margin: 10,
    borderColor: "black",
  },
  image: {
    resizeMode: "cover",
    justifyContent: "center",
  },
});
