import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, Alert, Vibration, Animated, Easing, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Keyboard from './Keyboard';
import SettingsScreen from './SettingsScreen';
import HowToPlayScreen from './HowToPlayScreen';
import wordsArray from './words.js';
import { useRoute } from '@react-navigation/native';
import {useSettings} from './SettingsContext';

const AppGame = () => {

  const { settings, toggleSound, toggleVibrations, toggleTheme } = useSettings();
  const [randomWord, setRandomWord] = useState('');
  const [guess, setGuess] = useState('');
  const [guesses, setGuesses] = useState(Array(6).fill(''));
  const [results, setResults] = useState([]);
  const [usedLetters, setUsedLetters] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [howToPlayVisible, setHowToPlayVisible] = useState(false);


  const [isFlipping, setIsFlipping] = useState(false);
  const [flipAnimations, setFlipAnimations] = useState(
    Array(6)
      .fill(null)
      .map(() => Array(5).fill().map(() => new Animated.Value(0)))
  );
  const [shakeAnimation] = useState(new Animated.Value(0));
  const [popupMessage, setPopupMessage] = useState('');
  const [currentRow, setCurrentRow] = useState(0);

     const generateRandomWord = (arr) => {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
};


    



  useEffect(() => {
    loadScore();
   
     setRandomWord(generateRandomWord(wordsArray));
    resetGame();
    
  }, []);








  const loadScore = async () => {
    try {
      const storedScore = await AsyncStorage.getItem('totalScore');
      if (storedScore !== null) {
        setTotalScore(parseInt(storedScore, 10));
      }
    } catch (error) {
      console.error('Failed to load score from AsyncStorage:', error);
    }
  };

  const saveScore = async () => {
    try {
      await AsyncStorage.setItem('totalScore', totalScore.toString());
      console.log('Saved score:', totalScore);
    } catch (error) {
      console.error('Failed to save score to AsyncStorage:', error);
    }
  };

  


 

  const resetGame = () => {
    setRandomWord(generateRandomWord(wordsArray));
    setGuess('');
    setGuesses(Array(6).fill(''));
    setResults([]);
    setUsedLetters([]);
    setFlipAnimations(
      Array(6)
        .fill(null)
        .map(() => Array(5).fill().map(() => new Animated.Value(0)))
    );
    setCurrentRow(0);
  };

  const handleInput = (letter) => {
    if (guess.length < 5) {
      const newGuess = guess + letter;
      setGuess(newGuess);
      
      
      const newGuesses = [...guesses];
      newGuesses[currentRow] = newGuess.padEnd(5, '');
      setGuesses(newGuesses); 

      if (settings.vibrations) {
        Vibration.vibrate(10);
      }
    }
  };

  const handleDelete = () => {
    const newGuess = guess.slice(0, -1);
    setGuess(newGuess);

    
    const newGuesses = [...guesses];
    newGuesses[currentRow] = newGuess.padEnd(5, '');
    setGuesses(newGuesses); 

    if (settings.vibrations) {
      Vibration.vibrate(10);
    }
  };

  const handleGameOver = (message) => {
    Alert.alert(
      'Game Over',
      message,
      [
        {
          text: 'New Game',
          onPress: resetGame
        },
        {
          text: 'Quit',
          style: 'cancel'
        }
      ],
      { cancelable: false }
    );
  };

  const handleSubmit = () => {
    if (guess.length !== 5) {
      setPopupMessage('Please enter a 5-letter word.');
      shakeCurrentRow();
      setTimeout(() => setPopupMessage(''), 2000);
      if (settings.vibrations) {
        Vibration.vibrate(400);
      }
      return;
    }
    console.log('isFlipping',isFlipping);
    console.log('randomword',randomWord);
    const normalizedGuess = guess.toLowerCase();
 
    if (!wordsArray.includes(normalizedGuess)) {
      setPopupMessage('Word not found');
      shakeCurrentRow();
      setTimeout(() => setPopupMessage(''), 2000);
      setGuess('');
      const newGuesses = [...guesses];
      newGuesses[currentRow] = ''.padEnd(5, '');
      setGuesses(newGuesses);
      if (settings.vibrations) {
        Vibration.vibrate(400);
      }
      return;
    }
  
    let tempResult = Array(5).fill('gray');
    let letterCount = {};
    let newUsedLetters = { ...usedLetters };
  
    for (let letter of randomWord) {
      letterCount[letter] = (letterCount[letter] || 0) + 1;
    }
  
    for (let i = 0; i < 5; i++) {
      if (normalizedGuess[i] === randomWord[i]) {
        tempResult[i] = 'green';
        letterCount[normalizedGuess[i]] -= 1;
      }
    }
    for (let i = 0; i < 5; i++) {
      if (tempResult[i] !== 'green' && randomWord.includes(normalizedGuess[i]) && letterCount[normalizedGuess[i]] > 0) {
        tempResult[i] = 'orange';
        letterCount[normalizedGuess[i]] -= 1;
      } else if (tempResult[i] !== 'green' && !randomWord.includes(normalizedGuess[i])) {
        newUsedLetters[normalizedGuess[i]] = 'grey';
      }
    }
  
    const nextGuesses = [...guesses];
    nextGuesses[currentRow] = normalizedGuess;
    setGuesses(nextGuesses);
    setResults(prev => [...prev, tempResult]);
    setUsedLetters(newUsedLetters);
    setGuess('');
  
    
    setIsFlipping(true);
    flipCurrentRow(() => {
      setIsFlipping(false);
 
      
      if(!isFlipping)
        {if (normalizedGuess === randomWord) {
        setTotalScore((6 - results.length) * 5 + totalScore);
        saveScore();
        handleGameOver(`Congratulations! You guessed the word in ${results.length + 1} tries!`);
      } else if (currentRow === 5) {
        handleGameOver(`You've run out of guesses. The word was ${randomWord}`);
      }
      setCurrentRow(currentRow + 1);
    }});
  };
  
  const flipCurrentRow = (onComplete) => {
    const flipAnimationsForRow = flipAnimations[currentRow].map((animation, index) =>
      Animated.sequence([
        Animated.delay(index * 150),
        Animated.timing(animation, {
          toValue: 1,
          duration: 300,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    );
  
   
    Animated.stagger(150, flipAnimationsForRow).start(() => {
      if (onComplete) {
        onComplete();
      }
    });
  };
  

  const shakeCurrentRow = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 1,
        duration: 100,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getFlipStyle = (index, letterIndex) => {
    const flipAnimation = flipAnimations[index][letterIndex];
    const rotateY = flipAnimation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ['0deg', '90deg', '0deg'],
    });

    const backgroundColor = flipAnimation.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: ['#fff', '#fff', getColorStyle(results[index] ? results[index][letterIndex] : 'white')],
    });

    return {
      transform: [{ rotateY }],
      backgroundColor,
    };
  };

  const getColorStyle = (color) => {
    switch (color) {
      case 'green':
        return 'green';
      case 'orange':
        return 'orange';
      case 'gray':
        return 'gray';
      default:
        return 'white';
    }
  };

  const getShakeStyle = () => {
    return {
      transform: [
        {
          translateX: shakeAnimation.interpolate({
            inputRange: [0, 0.25, 0.5, 0.75, 1],
            outputRange: [0, -10, 10, -10, 0],
          }),
        },
      ],
    };
  };

  const openSettingsModal = () => setSettingsModalVisible(true);
  const closeSettingsModal = () => setSettingsModalVisible(false);
  const openHowToPlayModal = () => setHowToPlayVisible(true);
  const closeHowToPlayModal = () => setHowToPlayVisible(false);



  
  return (
    <View style={settings.darkTheme ? styles.containerDark : styles.container}>
      <View style={styles.header}>
        <View style={styles.scoreContainer}>
          <Text style={[styles.scoreText, settings.darkTheme && styles.scoreTextDark]}>Score: {totalScore}</Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity onPress={openSettingsModal}>
              <Icon name="settings-outline" size={30} color={settings.darkTheme ? '#fff' : '#000'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={openHowToPlayModal}>
              <Icon name="help-circle-outline" size={30} color={settings.darkTheme ? '#fff' : '#000'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {guesses.map((g, index) => (
        <Animated.View
          key={index}
          style={[styles.guessContainer, index === currentRow ? getShakeStyle() : null]}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <Animated.View
              key={i}
              style={[
                styles.letterBox,
                getFlipStyle(index, i),
              ]}
            >
              <Text style={[styles.letter, settings.darkTheme && styles.letterDark]}>
                {g[i] ? g[i].toUpperCase() : ''}
              </Text>
            </Animated.View>
          ))}
        </Animated.View>
      ))}

      <Keyboard
        handleInput={handleInput}
        handleDelete={handleDelete}
        usedLetters={usedLetters}
        handleSubmit={handleSubmit}
      />

      {popupMessage ? (
        <View style={styles.popupContainer}>
          <Text style={styles.popupText}>{popupMessage}</Text>
        </View>
      ) : null}

     
        <Modal visible={settingsModalVisible} transparent animationType="slide">
  <SettingsScreen
    settings={settings}
    toggleVibrations={toggleVibrations}
    toggleSound={toggleSound}
    toggleTheme={toggleTheme}
    onClose={closeSettingsModal}
  />
</Modal>
      <Modal visible={howToPlayVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <HowToPlayScreen onClose={closeHowToPlayModal} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
  },
  containerDark: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#333',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: '#000',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  scoreText: {
    fontSize: 18,
    color: '#000',
  },
  guessContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  letterBox: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderWidth: 1,
    borderColor: 'black',
  },
  letter: {
    fontSize: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
   
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 0,
  },
  popupContainer: {
    position: 'absolute',
    bottom: 50,
    left: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    transform: [{ translateX: -50 }],
  },
  popupText: {
    color: 'white',
  },
});


export default AppGame;
