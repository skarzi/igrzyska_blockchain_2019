/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TextInput
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import {ethers, Wallet, utils} from 'ethers';
import {Buffer} from 'buffer';

import nfcTest from './etherum';

export default class App extends React.Component {
  state = {
    msg: '',
    text: ''
  };

  testNfc = async () => {
    let hash = utils.keccak256(Buffer.from(this.state.text)).substr(2);
    this.setState({
      msg: "Waiting for NFC card"
    });
    nfcTest('test123', hash).then((res) => {
      console.log(res);
      this.setState({
        msg: JSON.stringify(res)
      })
    }).catch(err => {
      console.log(err);
      this.setState({
        msg: JSON.stringify(err)
      });
    });
    setTimeout(() => {
      this.setState({
        msg: ""
      });
    }, 15000);
  };

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <View style={styles.body}>
            <Text style={styles.sectionTitle}>NFC encoder demo</Text>
              <TextInput
                  style={{ height: 40, borderColor: 'gray', borderWidth: 1, margin: 10 }}
                  onChangeText={text => { this.setState({text: text}); }}
                  value={this.state.text}
                />
              <TouchableOpacity
                style={styles.sectionContainer}
                onPress={this.testNfc}>
                <Text style={styles.sectionTitle}>Click to sign message</Text>
              </TouchableOpacity>
              <Text>{this.state.msg}</Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
    textAlign: 'center'
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});
