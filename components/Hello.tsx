import React from "react"
import { Button, StyleSheet, Text, View } from "react-native"
import * as firebase from 'firebase';
import * as firebaseConfig from '../constants/firebaseConfig';
import { YellowBox } from 'react-native';

export interface Props {
  name: string
  enthusiasmLevel?: number
}

interface State {
  enthusiasmLevel: number,
  data?:string
}

export class Hello extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    YellowBox.ignoreWarnings(['Setting a timer']);
    if ((props.enthusiasmLevel || 0) <= 0) {
      throw new Error("You could be a little more enthusiastic. :D")
    }

    this.state = {
      enthusiasmLevel: props.enthusiasmLevel || 1,
      data : ""
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig.default);
    }
  }

  componentDidMount() {
    firebase.database().ref('posts/testpost').once('value', (snapshot) => {
      const title = snapshot.val().title;
      console.log(`title is ${title}`);
      this.setState({data: snapshot.val().title});
    });
  }

  onIncrement = () => this.setState({ enthusiasmLevel: this.state.enthusiasmLevel + 1 });
  onDecrement = () => this.setState({ enthusiasmLevel: this.state.enthusiasmLevel - 1 });
  getExclamationMarks = (numChars: number) => Array(numChars + 1).join("!")

  render() {
    return (
      <View style={styles.root}>
        <Text style={styles.greeting}>
          Hello {this.props.name + this.getExclamationMarks(this.state.enthusiasmLevel)}
        </Text>
        <Text style={styles.greeting}>{this.state.data} </Text>

        <View style={styles.buttons}>
          <View style={styles.button}>
            <Button
              title="-"
              onPress={this.onDecrement}
              accessibilityLabel="decrement"
              color="red"
            />
          </View>

          <View style={styles.button}>
            <Button
              title="+"
              onPress={this.onIncrement}
              accessibilityLabel="increment"
              color="blue"
            />
          </View>
        </View>
      </View>
    )
  }
}

// styles

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    alignSelf: "center"
  },
  buttons: {
    flexDirection: "row",
    minHeight: 70,
    alignItems: "stretch",
    alignSelf: "center",
    borderWidth: 5
  },
  button: {
    flex: 1,
    paddingVertical: 0
  },
  greeting: {
    color: "#999",
    fontWeight: "bold"
  }
})