import React, { useState, useEffect } from 'react';

const MurderGame = () => {
  // Add Google Fonts import
  useEffect(() => {
    // Create a link element
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Kirang+Haerang&display=swap';
    link.rel = 'stylesheet';
    // Append to the document head
    document.head.appendChild(link);
    
    // Cleanup function to remove the link when the component unmounts
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Game states
  const [step, setStep] = useState(1);
  const [playerCount, setPlayerCount] = useState(3);
  const [playerNames, setPlayerNames] = useState(Array(3).fill(''));
  const [currentObjectIndex, setCurrentObjectIndex] = useState(0);
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [objects, setObjects] = useState([]);
  const [locations, setLocations] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [cards, setCards] = useState([]);
  const [flippedCardIndex, setFlippedCardIndex] = useState(null);

  /* [Insert the rest of the component code here] */
};

export default MurderGame;