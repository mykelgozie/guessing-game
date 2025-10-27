import React, { useState } from 'react';

const DifficultyLevels = {
  easy: { name: 'Easy', attempts: 15, color: 'bg-green-500' },
  medium: { name: 'Medium', attempts: 10, color: 'bg-yellow-500' },
  hard: { name: 'Hard', attempts: 5, color: 'bg-red-500' }
};

 function App() {
  const [difficulty, setDifficulty] = useState('medium');
  const [secretNumber, setSecretNumber] = useState(0);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(DifficultyLevels.medium.attempts);
  const [maxAttempts, setMaxAttempts] = useState(DifficultyLevels.medium.attempts);
  const [feedback, setFeedback] = useState('');
  const [gameStatus, setGameStatus] = useState('playing');
  const [guessHistory, setGuessHistory] = useState([]);
  const [showDifficultySelect, setShowDifficultySelect] = useState(true);
  const [inputError, setInputError] = useState('');
  const [shakeAnimation, setShakeAnimation] = useState(false);

  const generateSecretNumber = () => {
    return Math.floor(Math.random() * 100) + 1;
  };

  const startGame = (selectedDifficulty) => {
    const level = DifficultyLevels[selectedDifficulty];
    setDifficulty(selectedDifficulty);
    setSecretNumber(generateSecretNumber());
    setAttempts(level.attempts);
    setMaxAttempts(level.attempts);
    setGuess('');
    setFeedback('');
    setGameStatus('playing');
    setGuessHistory([]);
    setShowDifficultySelect(false);
    setInputError('');
  };

  const validateInput = (value) => {
    if (value === '') {
      setInputError('');
      return false;
    }
    
    const num = parseInt(value);
    
    if (isNaN(num)) {
      setInputError('Please enter a valid number');
      return false;
    }
    
    if (num < 1 || num > 100) {
      setInputError('Number must be between 1 and 100');
      return false;
    }
    
    if (guessHistory.includes(num)) {
      setInputError('You already guessed this number');
      return false;
    }
    
    setInputError('');
    return true;
  };

  const handleGuess = () => {
    if (!validateInput(guess)) {
      setShakeAnimation(true);
      setTimeout(() => setShakeAnimation(false), 500);
      return;
    }

    const numGuess = parseInt(guess);
    const newHistory = [...guessHistory, numGuess];
    setGuessHistory(newHistory);
    setAttempts(attempts - 1);

    if (numGuess === secretNumber) {
      setFeedback('🎉 Correct! You won!');
      setGameStatus('won');
    } else if (attempts - 1 === 0) {
      setFeedback(`😢 Game Over! The number was ${secretNumber}`);
      setGameStatus('lost');
    } else if (numGuess < secretNumber) {
      setFeedback('📈 Too low! Try a higher number.');
    } else {
      setFeedback('📉 Too high! Try a lower number.');
    }

    setGuess('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && gameStatus === 'playing') {
      handleGuess();
    }
  };

  const resetToMenu = () => {
    setShowDifficultySelect(true);
    setGuessHistory([]);
    setFeedback('');
  };

  if (showDifficultySelect) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full transform transition-all">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎯</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Number Guessing Game</h1>
            <p className="text-gray-600">Guess the secret number between 1 and 100!</p>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 text-center mb-4">Choose Difficulty</h2>
            {Object.entries(DifficultyLevels).map(([key, level]) => (
              <button
                key={key}
                onClick={() => startGame(key)}
                className={`w-full ${level.color} hover:opacity-90 text-white font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{level.name}</span>
                  <span className="flex items-center gap-2">
                    <span>❤️</span>
                    {level.attempts} attempts
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-4xl">🎯</span>
            <h1 className="text-3xl font-bold text-gray-800">Guess the Number</h1>
          </div>
          <p className="text-gray-600">Between 1 and 100</p>
          <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mt-2 ${DifficultyLevels[difficulty].color} text-white`}>
            {DifficultyLevels[difficulty].name} Mode
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">❤️</span>
            <span className="text-2xl font-bold text-gray-800">{attempts}</span>
            <span className="text-gray-600">/ {maxAttempts} attempts left</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(attempts / maxAttempts) * 100}%` }}
            />
          </div>
        </div>

        {gameStatus === 'playing' && (
          <div className="mb-6">
            <input
              type="text"
              value={guess}
              onChange={(e) => {
                setGuess(e.target.value);
                validateInput(e.target.value);
              }}
              onKeyPress={handleKeyPress}
              placeholder="Enter your guess"
              className={`w-full px-4 py-3 text-lg border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                shakeAnimation ? 'animate-shake' : ''
              } ${inputError ? 'border-red-500' : 'border-gray-300'}`}
              disabled={gameStatus !== 'playing'}
            />
            {inputError && (
              <p className="text-red-500 text-sm mt-2 font-semibold">{inputError}</p>
            )}
            <button
              onClick={handleGuess}
              className="w-full mt-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              Submit Guess
            </button>
          </div>
        )}

        {feedback && (
          <div className={`p-4 rounded-xl mb-6 text-center font-semibold text-lg transition-all transform ${
            gameStatus === 'won' ? 'bg-green-100 text-green-800 scale-105' :
            gameStatus === 'lost' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {feedback}
          </div>
        )}

        {guessHistory.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Previous Guesses:</h3>
            <div className="flex flex-wrap gap-2">
              {guessHistory.map((g, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    g < secretNumber && gameStatus !== 'playing' ? 'bg-orange-200 text-orange-800' :
                    g > secretNumber && gameStatus !== 'playing' ? 'bg-blue-200 text-blue-800' :
                    'bg-gray-200 text-gray-800'
                  }`}
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => startGame(difficulty)}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
          >
            <span className="text-xl">🔄</span>
            New Game
          </button>
          <button
            onClick={resetToMenu}
            className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
          >
            <span className="text-xl">🏆</span>
            Difficulty
          </button>
        </div>

        {gameStatus === 'won' && (
          <div className="mt-6 text-center">
            <div className="text-6xl animate-bounce">🏆</div>
            <p className="text-gray-600 mt-2">You guessed it in {guessHistory.length} {guessHistory.length === 1 ? 'try' : 'tries'}!</p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default App;
