import React, { useState, useEffect } from 'react';

const MurderGame = () => {
  // Add Google Fonts import
  useEffect(() => {
    // Create link elements for both fonts
    const kirangLink = document.createElement('link');
    kirangLink.href = 'https://fonts.googleapis.com/css2?family=Kirang+Haerang&display=swap';
    kirangLink.rel = 'stylesheet';

    const zainLink = document.createElement('link');
    zainLink.href = 'https://fonts.googleapis.com/css2?family=Zain&display=swap';
    zainLink.rel = 'stylesheet';

    // Append to the document head
    document.head.appendChild(kirangLink);
    document.head.appendChild(zainLink);
    
    // Cleanup function to remove the links when the component unmounts
    return () => {
      document.head.removeChild(kirangLink);
      document.head.removeChild(zainLink);
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
    // Create arrays of available targets, weapons, and locations
    let availableTargets = [...playerNames];
    let availableWeapons = [...weapons];
    let availableLocations = [...locations];
    
    // Generate cards with unique assignments
    const newCards = playerNames.map((name, index) => {
      // Remove current player from available targets
      const playerTargets = availableTargets.filter(target => target !== name);
      
      // Select a random target from available targets
      const targetIndex = Math.floor(Math.random() * playerTargets.length);
      const target = playerTargets[targetIndex];
      
      // Remove selected target from available targets
      availableTargets = availableTargets.filter(t => t !== target);
      
      // Select a random weapon from available weapons
      const weaponIndex = Math.floor(Math.random() * availableWeapons.length);
      const weapon = availableWeapons[weaponIndex];
      
      // Remove selected weapon from available weapons
      availableWeapons = availableWeapons.filter(w => w !== weapon);
      
      // Select a random location from available locations
      const locationIndex = Math.floor(Math.random() * availableLocations.length);
      const location = availableLocations[locationIndex];
      
      // Remove selected location from available locations
      availableLocations = availableLocations.filter(l => l !== location);

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

  // Handle keyboard events
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      switch (step) {
        case 1:
          setPlayerNames(Array(playerCount).fill(''));
          setStep(2);
          break;
        case 2:
          if (!playerNames.some(name => !name.trim())) {
            setWeapons(Array(playerCount).fill(''));
            setStep(3);
          }
          break;
        case 3:
          if (weapons[currentWeaponIndex]?.trim()) {
            if (currentWeaponIndex === playerCount - 1) {
              setLocations(Array(playerCount).fill(''));
              setStep(4);
            } else {
              setCurrentWeaponIndex(currentWeaponIndex + 1);
            }
          }
          break;
        case 4:
          if (locations[currentLocationIndex]?.trim()) {
            if (currentLocationIndex === playerCount - 1) {
              generateCards();
              setStep(5);
            } else {
              setCurrentLocationIndex(currentLocationIndex + 1);
            }
          }
          break;
        default:
          break;
      }
    }
  };

  // Add keyboard event listener
  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);
    return () => {
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [step, playerCount, playerNames, weapons, currentWeaponIndex, locations, currentLocationIndex]);

  // Render step 1: Player count
  const renderPlayerCount = () => (
    <div className="space-y-6 relative min-h-[200px]">
      <h2 className="text-3xl font-thin">How many people are playing?</h2>
      <div className="space-y-4">
        <input
          type="range"
          min="3"
          max="20"
          value={playerCount}
          onChange={handlePlayerCountChange}
          className="w-full"
        />
        <div className="text-center text-4xl font-bold">{playerCount}</div>
      </div>
      <div className="absolute bottom-0 right-0">
        <button
          onClick={() => {
            setPlayerNames(Array(playerCount).fill(''));
            setStep(2);
          }}
          className="px-4 py-2 text-2xl bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );

  // Render step 2: Player names
  const renderPlayerNames = () => (
    <div className="space-y-6 relative min-h-[200px]">
      <h2 className="text-3xl font-thin">What are their names?</h2>
      <div className="space-y-4 pb-16">
        {playerNames.map((name, index) => (
          <div key={index} className="space-y-2">
            <input
              type="text"
              value={name}
              onChange={(e) => handlePlayerNameChange(index, e.target.value)}
              placeholder={`Enter Player ${index + 1}'s name`}
              className="w-full px-3 py-2.5 text-2xl bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0">
        <button
          onClick={() => setStep(1)}
          className="px-4 py-2 text-2xl bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
      </div>
      <div className="absolute bottom-0 right-0">
        <button
          onClick={() => {
            setWeapons(Array(playerCount).fill(''));
            setStep(3);
          }}
          disabled={playerNames.some(name => !name.trim())}
          className={`px-4 py-2 text-2xl rounded-md transition-colors ${
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
    <div className="space-y-6 relative min-h-[200px]">
      <h2 className="text-3xl font-thin">Enter murder weapons ({currentWeaponIndex + 1} of {playerCount})</h2>
      <div className="space-y-2">
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
            style={{ width: `${((currentWeaponIndex + 1) / playerCount) * 100}%` }}
          />
        </div>
      </div>
      <div className="space-y-4 pb-16">
        <input
          type="text"
          value={weapons[currentWeaponIndex] || ''}
          onChange={(e) => {
            const newWeapons = [...weapons];
            newWeapons[currentWeaponIndex] = e.target.value;
            setWeapons(newWeapons);
          }}
          placeholder="e.g. a large branch, an egg, three paperclips"
          className="w-full px-3 py-2.5 text-2xl bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="absolute bottom-0 left-0">
        <button
          onClick={() => {
            if (currentWeaponIndex > 0) {
              setCurrentWeaponIndex(currentWeaponIndex - 1);
            } else {
              setStep(2);
            }
          }}
          className="px-4 py-2 text-2xl bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
      </div>
      <div className="absolute bottom-0 right-0">
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
          className={`px-4 py-2 text-2xl rounded-md transition-colors ${
            !weapons[currentWeaponIndex]?.trim()
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );

  // Render step 4: Locations
  const renderLocations = () => (
    <div className="space-y-6 relative min-h-[200px]">
      <h2 className="text-3xl font-thin">Enter murder locations ({currentLocationIndex + 1} of {playerCount})</h2>
      <div className="space-y-2">
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
            style={{ width: `${((currentLocationIndex + 1) / playerCount) * 100}%` }}
          />
        </div>
      </div>
      <div className="space-y-4 pb-16">
        <input
          type="text"
          value={locations[currentLocationIndex] || ''}
          onChange={(e) => {
            const newLocations = [...locations];
            newLocations[currentLocationIndex] = e.target.value;
            setLocations(newLocations);
          }}
          placeholder="e.g. on a couch, in the bathroom, under a table"
          className="w-full px-3 py-2.5 text-2xl bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
      </div>
      <div className="absolute bottom-0 left-0">
        <button
          onClick={() => setStep(3)}
          className="px-4 py-2 text-2xl bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
      </div>
      <div className="absolute bottom-0 right-0">
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
          className={`px-4 py-2 text-2xl rounded-md transition-colors ${
            !locations[currentLocationIndex]?.trim()
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {currentLocationIndex === playerCount - 1 ? 'Start Game' : 'Next'}
        </button>
      </div>
    </div>
  );

  // Render step 5: Cards
  const renderCards = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-black">Let's begin!</h2>
        <p className="text-gray-300 text-xl md:text-2xl">
          Click below to see your assignment. Remember, your target must willingly accept your weapon in the assigned location and there must be a witness. Happy murdering 😉
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => handleCardFlip(index)}
            className={`relative h-48 sm:h-56 md:h-64 cursor-pointer transition-all duration-500 ${
              flippedCardIndex !== null && flippedCardIndex !== index ? 'opacity-30 blur-sm' : ''
            }`}
          >
            <div className={`absolute w-full h-full transition-all duration-500 transform ${
              card.isFlipped ? 'rotate-y-180 opacity-0' : 'rotate-y-0 opacity-100'
            }`}>
              <div className="w-full h-full bg-blue-600 rounded-lg shadow-lg flex items-center justify-center p-4">
                <h3 className="text-3xl md:text-4xl font-bold text-white text-center">{card.name}</h3>
              </div>
            </div>
            <div className={`absolute w-full h-full transition-all duration-500 transform ${
              card.isFlipped ? 'rotate-y-0 opacity-100' : '-rotate-y-180 opacity-0'
            }`}>
              <div className="w-full h-full bg-blue-900/80 rounded-lg shadow-lg flex flex-col items-center justify-center p-4">
                <div className="text-white text-center space-y-2">
                  <p className="text-xl md:text-2xl mb-4">{card.name}, your target is:</p>
                  <p className="text-2xl md:text-3xl">🎯 {card.target}</p>
                  <p className="text-2xl md:text-3xl">🔪 {card.weapon}</p>
                  <p className="text-2xl md:text-3xl">📍 {card.location}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white font-['Zain']">
      <div className="w-screen px-4 py-8">
        <div className="flex items-center justify-center gap-4 mb-8">
          <h1 className="text-6xl font-bold font-['Kirang_Haerang']">
            murder game
          </h1>
          <button
            onClick={resetGame}
            className="text-3xl hover:text-blue-400 transition-colors"
            title="Reset Game"
          >
            ↻
          </button>
        </div>
        <div className="w-full md:w-[50vw] mx-auto rounded-lg p-4 sm:p-6 md:p-8">
          {step === 1 && renderPlayerCount()}
          {step === 2 && renderPlayerNames()}
          {step === 3 && renderWeapons()}
          {step === 4 && renderLocations()}
          {step === 5 && renderCards()}
        </div>
        <div className="mt-8 text-center">
          <a
            href="https://github.com/ryskwok/murder-game"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block hover:opacity-80 transition-opacity"
          >
            <svg
              className="w-8 h-8"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MurderGame;