import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const LetterBox = ({ letter, status }) => {
  let backgroundColor = '#ddd';

  switch (status) {
    case 'correct':
      backgroundColor = '#6aaa64'; // green
      break;
    case 'misplaced':
      backgroundColor = '#c9b458'; // yellow
      break;
    case 'wrong':
      backgroundColor = '#787c7e'; // grey
      break;
  }

  return (
    <View style={[styles.letterBox, { backgroundColor }]}>
      <Text style={styles.letter}>{letter}</Text>
    </View>
  );
};

const HowToPlayScreen = ({ visible, onClose }) => {
  return (
   
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>How to Play Wordle</Text>
          <Text style={styles.description}>
            Guess the hidden 5-letter word in 6 tries. After each guess, the color of the letters will indicate how close your guess was.
          </Text>

          <View style={styles.exampleSection}>
            <Text style={styles.subtitle}>Examples:</Text>

            <View style={styles.row}>
              <LetterBox letter="W" status="correct" />
              <LetterBox letter="E" />
              <LetterBox letter="A" />
              <LetterBox letter="R" />
              <LetterBox letter="Y" />
            </View>
            <Text style={styles.caption}>W is in the word and in the correct spot.</Text>

            <View style={styles.row}>
              <LetterBox letter="P" />
              <LetterBox letter="I" status="misplaced" />
              <LetterBox letter="L" />
              <LetterBox letter="L" />
              <LetterBox letter="S" />
            </View>
            <Text style={styles.caption}>I is in the word but in the wrong spot.</Text>

            <View style={styles.row}>
              <LetterBox letter="V" />
              <LetterBox letter="A" />
              <LetterBox letter="G" />
              <LetterBox letter="U" status="wrong" />
              <LetterBox letter="E" />
            </View>
            <Text style={styles.caption}>U is not in the word at all.</Text>
          </View>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Got it!</Text>
          </TouchableOpacity>
        </View>
      </View>
   
  );
};

export default HowToPlayScreen;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  exampleSection: {
    marginBottom: 20,
  },
  subtitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  letterBox: {
    width: 40,
    height: 40,
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  letter: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  caption: {
    fontSize: 14,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});