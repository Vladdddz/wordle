import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const keys = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['DEL', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'ENTER'],
];

const SCREEN_WIDTH = Dimensions.get('window').width;

const Keyboard = ({ handleInput, handleDelete, handleSubmit, usedLetters = [] }) => {
  const handleKeyPress = (key) => {
    if (key === 'DEL') {
      handleDelete();
    } else if (key === 'ENTER') {
      handleSubmit();
    } else {
      handleInput(key.toLowerCase());
    }
  };

 return (
  <View style={[styles.container, { width: SCREEN_WIDTH }]}>
    {keys.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.row}>
        {row.map((key) => {
          const lowerKey = key.toLowerCase();
          const keyStatus = usedLetters[lowerKey]; // 'green', 'orange', 'grey', or undefined

          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.key,
                (key === 'DEL' || key === 'ENTER') && styles.specialKey,
                keyStatus === 'green' && styles.keyGreen,
                keyStatus === 'orange' && styles.keyOrange,
                keyStatus === 'grey' && styles.keyGrey,
              ]}
              onPress={() => handleKeyPress(key)}
            >
              <Text style={styles.keyText}>{key}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    ))}
  </View>
);}
export default Keyboard;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 10,
    paddingLeft: 100,
    paddingRight: 100,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  key: {
    backgroundColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 3,
    borderRadius: 6,
    minWidth: 15,
    alignItems: 'center',
  },
  keyText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  specialKey: {
    backgroundColor: '#aaa',
    minWidth: 60,
  },
  usedKey: {
    backgroundColor: '#bbb', // greyed out
  },
  keyGreen: {
  backgroundColor: '#6aaa64', // Wordle green
},
keyOrange: {
  backgroundColor: '#c9b458', // Wordle yellow/orange
},
keyGrey: {
  backgroundColor: '#787c7e', // Wordle grey
},
});
