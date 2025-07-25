import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {useSettings} from './SettingsContext';
import HowToPlayScreen from './HowToPlayScreen';
import SettingsScreen from './SettingsScreen';
import { useRoute } from '@react-navigation/native';
const getRandomColor = () => {
  const colors = ['green', 'orange', 'grey'];
  return colors[Math.floor(Math.random() * colors.length)];
};
 
const AnimatedTitle = ({ theme }) => {
  const [bounceAnim] = useState(new Animated.Value(0));
  const [colorAnim] = useState(new Animated.Value(0));
  const [colors, setColors] = useState(Array(7).fill(theme === 'dark' ? 'white' : 'black')); // Dark theme support

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.bounce,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handlePress = () => {
    const newColors = colors.map(() => getRandomColor());
    setColors(newColors);

    setTimeout(() => {
      Animated.timing(colorAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start(() => {
        setColors(Array(7).fill(theme === 'dark' ? 'white' : 'black')); 
        colorAnim.setValue(0);
      });
    }, 3000);
  };

  const interpolatedColors = colors.map((color) => {
    return colorAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [color, theme === 'dark' ? 'white' : 'black'],
    });
  });

  const bounce = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  return (
    <TouchableOpacity onPress={handlePress}>
      <Animated.View style={{ transform: [{ translateY: bounce }] }}>
        <View style={styles.titleContainer}>
          {['W', 'o', 'r', 'd', 'l', 'e', '!'].map((letter, index) => (
            <Animated.Text key={index} style={[styles.titleLetter, { color: interpolatedColors[index] }]}>
              {letter}
            </Animated.Text>
          ))}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const HomeScreen = () => {
   const { settings, toggleSound, toggleVibrations, toggleTheme } = useSettings();
  const navigation = useNavigation();

  const [scoreboard, setScoreboard] = useState([
    { name: 'Alice', score: 100 },
    { name: 'Bob', score: 80 },
    { name: 'Charlie', score: 60 },
    { name: 'Dave', score: 40 },
    { name: 'Eve', score: 20 },
  ]);
  const [userScore, setUserScore] = useState(0);

  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [howToPlayModalVisible, setHowToPlayModalVisible] = useState(false);

    const openSettingsModal = () => setSettingsModalVisible(true);
  const closeSettingsModal = () => setSettingsModalVisible(false);
  const openHowToPlayModal = () => setHowToPlayModalVisible(true);
  const closeHowToPlayModal = () => setHowToPlayModalVisible(false);
  useEffect(() => {
    loadUserScore();

  }, []);

  const loadUserScore = async () => {
    try {
      const storedScore = await AsyncStorage.getItem('totalScore');
      if (storedScore !== null) {
        const score = parseInt(storedScore, 10);
        setUserScore(score);
        updateScoreboard(score);
      }
    } catch (error) {
      console.error('Failed to load score from AsyncStorage:', error);
    }
  };

  const updateScoreboard = (score) => {
    const updatedScoreboard = scoreboard
      .filter(entry => entry.name !== 'You')
      .concat({ name: 'You', score })
      .sort((a, b) => b.score - a.score);
    setScoreboard(updatedScoreboard);
  };



  const handlePlayPress = () => {
    navigation.navigate('AppGame', { settings }); 
  };

  const renderScoreboard = () => {
    const isDarkTheme = settings.darkTheme === 'dark';
    return (
      <View style={isDarkTheme ? styles.scoreboardDark : styles.scoreboard}>
        <Text style={isDarkTheme ? styles.scoreboardTitleDark : styles.scoreboardTitle}>Scoreboard</Text>
        {scoreboard.map((entry, index) => (
          <View
            key={index}
            style={[
              styles.scoreEntry,
              entry.name === 'You' && (isDarkTheme ? styles.userScoreEntryDark : styles.userScoreEntry), 
            ]}
          >
            <Text style={isDarkTheme ? styles.scoreNameDark : styles.scoreName}>{entry.name}</Text>
            <Text style={isDarkTheme ? styles.scoreValueDark : styles.scoreValue}>{entry.score}</Text>
          </View>
        ))}
      </View>
    );
  };

  const isDarkTheme = settings.theme === 'dark';

  return (
    <View style={isDarkTheme ? styles.containerDark : styles.container}>
      <AnimatedTitle theme={settings.theme} />
      <TouchableOpacity style={isDarkTheme ? styles.playButtonDark : styles.playButton} onPress={handlePlayPress}>
        <Text style={styles.playButtonText}>Play</Text>
      </TouchableOpacity>
      {renderScoreboard()}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => setSettingsModalVisible(true)}>
          <FontAwesome name="cog" size={30} color={isDarkTheme ? 'white' : 'black'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setHowToPlayModalVisible(true)}>
          <FontAwesome name="question-circle" size={30} color={isDarkTheme ? 'white' : 'black'} />
        </TouchableOpacity>
      </View>

      {/* Settings Modal */}
      <Modal visible={settingsModalVisible} transparent animationType="slide">
  <SettingsScreen
    settings={settings}
    toggleVibrations={toggleVibrations}
    toggleSound={toggleSound}
    toggleTheme={toggleTheme}
    onClose={closeSettingsModal}
  />
</Modal>

      {/* How To Play Modal */}
      <Modal visible={howToPlayModalVisible} animationType="slide" transparent={true}>
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
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleLetter: {
    fontSize: 48,
    fontWeight: 'bold',
    marginHorizontal: 2,
  },
  playButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 20,
  },
  playButtonDark: {
    backgroundColor: '#2E8B57',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 20,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scoreboard: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    marginBottom: 20,
  },
  scoreboardDark: {
    width: '100%',
    backgroundColor: '#444', 
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    marginBottom: 20,
  },
  scoreboardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#000',
  },
  scoreboardTitleDark: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#fff', 
  },
  scoreEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    width: '100%',
  },
  userScoreEntry: {
    backgroundColor: '#e0f7fa', 
  },
  userScoreEntryDark: {
    backgroundColor: '#666',
  },
  scoreName: {
    fontSize: 18,
    color: '#000',
  },
  scoreNameDark: {
    fontSize: 18,
    color: '#fff',
  },
  scoreValue: {
    fontSize: 18,
    color: '#000',
  },
  scoreValueDark: {
    fontSize: 18,
    color: '#fff', 
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  fullScreenModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default HomeScreen;
