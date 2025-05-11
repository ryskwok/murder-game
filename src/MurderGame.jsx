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
  const [playerNames, setPlayerNames] = useState([]);
  const [weapons, setWeapons] = useState([]);
  const [locations, setLocations] = useState([]);
  const [cards, setCards] = useState([]);
  const [flippedCardIndex, setFlippedCardIndex] = useState(null);
  const [currentWeaponIndex, setCurrentWeaponIndex] = useState(0);
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);

  // Handle player count change
  const handlePlayerCountChange = (e) => {
    setPlayerCount(parseInt(e.target.value));
  };

  // Handle player name change
  const handlePlayerNameChange = (index, value) => {
    const newNames = [...playerNames];
    newNames[index] = value;
    setPlayerNames(newNames);
  };

  // Handle weapon input
  const handleWeaponSubmit = (weapon) => {
    setWeapons([...weapons, weapon]);
    setCurrentWeaponIndex(currentWeaponIndex + 1);
  };

  // Handle location input
  const handleLocationSubmit = (location) => {
    setLocations([...locations, location]);
    setCurrentLocationIndex(currentLocationIndex + 1);
  };

  // Generate cards
  const generateCards = () => {
    // Create a copy of player names for target assignment
    let remainingTargets = [...playerNames];
    
    // Generate cards with unique targets
    const newCards = playerNames.map((name, index) => {
      // Remove current player from available targets
      const availableTargets = remainingTargets.filter(target => target !== name);
      
      // Select a random target from available targets
      const targetIndex = Math.floor(Math.random() * availableTargets.length);
      const target = availableTargets[targetIndex];
      
      // Remove selected target from remaining targets
      remainingTargets = remainingTargets.filter(t => t !== target);
      
      // Generate random weapon and location
      const weapon = weapons[Math.floor(Math.random() * weapons.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];

      return {
        name,
        target,
        weapon,
        location,
        isFlipped: false
      };
    });

    // Shuffle cards
    setCards(newCards.sort(() => Math.random() - 0.5));
  };

  // Handle card flip
  const handleCardFlip = (index) => {
    if (flippedCardIndex !== null && flippedCardIndex !== index) {
      return; // Can't flip another card until current one is flipped back
    }
    
    const newCards = [...cards];
    newCards[index].isFlipped = !newCards[index].isFlipped;
    setCards(newCards);
    setFlippedCardIndex(newCards[index].isFlipped ? index : null);
  };

  // Reset game state
  const resetGame = () => {
    setStep(1);
    setPlayerCount(3);
    setPlayerNames([]);
    setWeapons([]);
    setLocations([]);
    setCards([]);
    setFlippedCardIndex(null);
    setCurrentWeaponIndex(0);
    setCurrentLocationIndex(0);
  };

  // Render step 1: Player count
  const renderPlayerCount = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">How many people are playing?</h2>
      <div className="space-y-4">
        <input
          type="range"
          min="3"
          max="20"
          value={playerCount}
          onChange={handlePlayerCountChange}
          className="w-full"
        />
        <div className="text-center text-xl font-bold">{playerCount}</div>
      </div>
      <button
        onClick={() => {
          setPlayerNames(Array(playerCount).fill(''));
          setStep(2);
        }}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Next
      </button>
    </div>
  );

  // Render step 2: Player names
  const renderPlayerNames = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">What are their names?</h2>
      <div className="space-y-4">
        {playerNames.map((name, index) => (
          <div key={index} className="space-y-2">
            <label className="block text-sm font-medium">
              Player {index + 1}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handlePlayerNameChange(index, e.target.value)}
              placeholder={`Enter Player ${index + 1}'s name`}
              className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>
      <div className="flex space-x-4">
        <button
          onClick={() => setStep(1)}
          className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => {
            setWeapons(Array(playerCount).fill(''));
            setStep(3);
          }}
          disabled={playerNames.some(name => !name.trim())}
          className={`flex-1 px-4 py-2 rounded-md transition-colors ${
            playerNames.some(name => !name.trim())
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );

  // Render step 3: Weapons
  const renderWeapons = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Enter murder weapons</h2>
      <div className="text-center text-lg">
        Weapon {currentWeaponIndex + 1} of {playerCount}
      </div>
      <div className="space-y-4">
        <input
          type="text"
          value={weapons[currentWeaponIndex] || ''}
          onChange={(e) => {
            const newWeapons = [...weapons];
            newWeapons[currentWeaponIndex] = e.target.value;
            setWeapons(newWeapons);
          }}
          placeholder="Enter a weapon"
          className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex space-x-4">
        <button
          onClick={() => setStep(2)}
          className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => {
            if (currentWeaponIndex === playerCount - 1) {
              setLocations(Array(playerCount).fill(''));
              setStep(4);
            } else {
              setCurrentWeaponIndex(currentWeaponIndex + 1);
            }
          }}
          disabled={!weapons[currentWeaponIndex]?.trim()}
          className={`flex-1 px-4 py-2 rounded-md transition-colors ${
            !weapons[currentWeaponIndex]?.trim()
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {currentWeaponIndex === playerCount - 1 ? 'Next' : 'Next Weapon'}
        </button>
      </div>
    </div>
  );

  // Render step 4: Locations
  const renderLocations = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Enter murder locations</h2>
      <div className="text-center text-lg">
        Location {currentLocationIndex + 1} of {playerCount}
      </div>
      <div className="space-y-4">
        <input
          type="text"
          value={locations[currentLocationIndex] || ''}
          onChange={(e) => {
            const newLocations = [...locations];
            newLocations[currentLocationIndex] = e.target.value;
            setLocations(newLocations);
          }}
          placeholder="Enter a location"
          className="w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex space-x-4">
        <button
          onClick={() => setStep(3)}
          className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
        <button
          onClick={() => {
            if (currentLocationIndex === playerCount - 1) {
              generateCards();
              setStep(5);
            } else {
              setCurrentLocationIndex(currentLocationIndex + 1);
            }
          }}
          disabled={!locations[currentLocationIndex]?.trim()}
          className={`flex-1 px-4 py-2 rounded-md transition-colors ${
            !locations[currentLocationIndex]?.trim()
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {currentLocationIndex === playerCount - 1 ? 'Start Game' : 'Next Location'}
        </button>
      </div>
    </div>
  );

  // Render step 5: Cards
  const renderCards = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-center">murder game cards</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => handleCardFlip(index)}
            className={`relative h-48 sm:h-56 md:h-64 cursor-pointer transition-transform duration-500 transform ${
              card.isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            <div className={`absolute w-full h-full backface-hidden ${
              card.isFlipped ? 'hidden' : 'block'
            }`}>
              <div className="w-full h-full bg-blue-600 rounded-lg shadow-lg flex items-center justify-center p-4">
                <h3 className="text-xl md:text-2xl font-bold text-white text-center">{card.name}</h3>
              </div>
            </div>
            <div className={`absolute w-full h-full backface-hidden ${
              card.isFlipped ? 'block' : 'hidden'
            }`}>
              <div className="w-full h-full bg-red-600 rounded-lg shadow-lg flex flex-col items-center justify-center p-4">
                <div className="text-white text-center space-y-2">
                  <p className="text-base md:text-lg">Target: {card.target}</p>
                  <p className="text-base md:text-lg">Weapon: {card.weapon}</p>
                  <p className="text-base md:text-lg">Location: {card.location}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center gap-4 mb-8">
          <h1 className="text-4xl font-bold font-['Kirang_Haerang']">
            murder game
          </h1>
          <button
            onClick={resetGame}
            className="text-2xl hover:text-blue-400 transition-colors"
            title="Reset Game"
          >
            ↻
          </button>
        </div>
        <div className="w-full max-w-7xl mx-auto bg-gray-800 rounded-lg shadow-xl p-4 sm:p-6 md:p-8">
          {step === 1 && renderPlayerCount()}
          {step === 2 && renderPlayerNames()}
          {step === 3 && renderWeapons()}
          {step === 4 && renderLocations()}
          {step === 5 && renderCards()}
        </div>
      </div>
    </div>
  );
};

export default MurderGame;