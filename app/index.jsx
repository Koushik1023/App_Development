import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity } from 'react-native';

const generateCards = () => {
  const items = ['🐶', '🐱', '🐭', '🐹', '🤥', '🦊'];
  const cards = [...items, ...items]
    .sort(() => Math.random() - 0.5)
    .map((item, index) => ({ id: index, value: item, isFlipped: false, isMatched: false }));
  return cards;
};

const Card = ({ card, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.card}>
    <Text style={styles.cardText}>{card.isFlipped || card.isMatched ? card.value : '❓'}</Text>
  </TouchableOpacity>
);

export default function App() {
  const [cards, setCards] = useState(generateCards());
  const [selectedCards, setSelectedCards] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [player1Matches, setPlayer1Matches] = useState(0);
  const [player2Matches, setPlayer2Matches] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [mode, setMode] = useState(null);

  useEffect(() => {
    if (selectedCards.length === 2) {
      const [first, second] = selectedCards;
      if (first.value === second.value) {
        setCards((prevCards) =>
          prevCards.map((card) => (card.value === first.value ? { ...card, isMatched: true } : card))
        );
        if (mode === 'multiplayer') {
          currentPlayer === 1 ? setPlayer1Matches((prev) => prev + 1) : setPlayer2Matches((prev) => prev + 1);
        }
      } else {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === first.id || card.id === second.id ? { ...card, isFlipped: false } : card
            )
          );
        }, 600);
      }
      setSelectedCards([]);
      setMoves((prevMoves) => prevMoves + 1);
      if (mode === 'multiplayer') {
        setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
      }
    }
  }, [selectedCards]);

  useEffect(() => {
    if (cards.every((card) => card.isMatched)) {
      setIsGameOver(true);
      clearInterval(intervalId);
    }
  }, [cards]);

  useEffect(() => {
    if (isGameOver) return;
    const id = setInterval(() => setTimer((prevTime) => prevTime + 1), 1000);
    setIntervalId(id);
    return () => clearInterval(id);
  }, [isGameOver]);

  const handleCardPress = (card) => {
    if (card.isFlipped || selectedCards.length === 2) return;
    setCards((prevCards) => prevCards.map((c) => (c.id === card.id ? { ...c, isFlipped: true } : c)));
    setSelectedCards((prev) => [...prev, card]);
  };

  const resetGame = () => {
    setCards(generateCards());
    setSelectedCards([]);
    setIsGameOver(false);
    setMoves(0);
    setTimer(0);
    setPlayer1Matches(0);
    setPlayer2Matches(0);
    setCurrentPlayer(1);
    setMode(null);
    setIntervalId(null);
  };

  if (!mode) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Memory Magic</Text>
        <Button title="Single Player" onPress={() => setMode('single')} />
        <Button title="Multiplayer" onPress={() => setMode('multiplayer')} />
      </View>
    );
  }

  const winner = player1Matches > player2Matches ? 'Player 1 Wins!' : player1Matches < player2Matches ? 'Player 2 Wins!' : "It's a Tie!";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Memory Magic</Text>
      <View style={styles.dashboard}>
        {mode === 'multiplayer' && (
          <>
            <Text style={styles.stats}>Player 1 Matches: {player1Matches}</Text>
            <Text style={styles.stats}>Player 2 Matches: {player2Matches}</Text>
            <Text style={styles.stats}>Current Turn: Player {currentPlayer}</Text>
          </>
        )}
        <Text style={styles.stats}>Moves: {moves}</Text>
        <Text style={styles.stats}>Time: {timer}s</Text>
        {isGameOver && <Text style={styles.gameOverText}>{winner}</Text>}
      </View>

      <FlatList
        data={cards}
        numColumns={3}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Card card={item} onPress={() => handleCardPress(item)} />}
        contentContainerStyle={styles.board}
      />

      <Button title="Restart Game" onPress={resetGame} color="#FF5722" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF5722',
    marginBottom: 20,
  },
  dashboard: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  stats: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    margin: 5,
    textAlign: 'center',
  },
  board: {
    justifyContent: 'center',
    marginBottom: 20,
  },
  card: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderRadius: 10,
  },
  cardText: {
    fontSize: 40,
    color: '#FF5723',
  },
});