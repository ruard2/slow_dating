import { useState, useEffect, useCallback } from 'react';
import socket from './socket.js';
import Lobby from './components/Lobby.jsx';
import WaitingRoom from './components/WaitingRoom.jsx';
import Game from './components/Game.jsx';

const INITIAL_GAME = {
  roomId: null,
  playerNames: { 0: '', 1: '' },
  positions: [0, 0],
  clothing: [5, 5],
  currentTurn: 0,
  phase: 'waiting',
  winner: null,
  powerSwitch: null,
  diceValue: null,
  playerCount: 1,
};

export default function App() {
  const [screen, setScreen] = useState('lobby'); // lobby | waiting | game
  const [myPlayerNumber, setMyPlayerNumber] = useState(null);
  const [myName, setMyName] = useState('');
  const [roomId, setRoomId] = useState(null);
  const [game, setGame] = useState(INITIAL_GAME);
  const [error, setError] = useState('');
  const [rolling, setRolling] = useState(false);
  const [lastMove, setLastMove] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => setError(''));
    socket.on('connect_error', () => setError('Kan geen verbinding maken met de server.'));

    socket.on('room_created', ({ roomId, playerNumber, game }) => {
      setRoomId(roomId);
      setMyPlayerNumber(playerNumber);
      setGame(game);
      setScreen('waiting');
    });

    socket.on('room_joined', ({ roomId, playerNumber, game }) => {
      setRoomId(roomId);
      setMyPlayerNumber(playerNumber);
      setGame(game);
    });

    socket.on('game_start', ({ game }) => {
      setGame(game);
      setScreen('game');
    });

    socket.on('move_result', (data) => {
      setRolling(false);
      setLastMove(data.result || {});
      setGame((prev) => ({
        ...prev,
        positions: data.positions,
        clothing: data.clothing,
        phase: data.phase,
        winner: data.winner,
        diceValue: data.diceValue,
        powerSwitch: data.powerSwitch,
        currentTurn: data.currentTurn,
      }));
    });

    socket.on('turn_advanced', (data) => {
      setGame((prev) => ({
        ...prev,
        phase: data.phase,
        currentTurn: data.currentTurn,
        powerSwitch: data.powerSwitch,
        clothing: data.clothing,
        diceValue: null,
      }));
      setLastMove(null);
    });

    socket.on('player_disconnected', ({ message }) => {
      setError(message);
    });

    socket.on('error', ({ message }) => {
      setError(message);
    });

    socket.on('chat_message', (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('room_created');
      socket.off('room_joined');
      socket.off('game_start');
      socket.off('move_result');
      socket.off('turn_advanced');
      socket.off('player_disconnected');
      socket.off('error');
      socket.off('chat_message');
      socket.disconnect();
    };
  }, []);

  const handleCreateRoom = useCallback((name) => {
    setMyName(name);
    setError('');
    socket.emit('create_room', { playerName: name });
  }, []);

  const handleJoinRoom = useCallback((name, code) => {
    setMyName(name);
    setError('');
    socket.emit('join_room', { roomId: code, playerName: name });
    setScreen('game');
  }, []);

  const handleRollDice = useCallback(() => {
    if (rolling) return;
    setRolling(true);
    socket.emit('roll_dice');
  }, [rolling]);

  const handleActionDone = useCallback(() => {
    socket.emit('action_done');
  }, []);

  const handleDrawEventCard = useCallback(() => {
    socket.emit('draw_event_card');
  }, []);

  const handleSendChat = useCallback((text) => {
    socket.emit('chat_message', { text });
    setChatMessages((prev) => [...prev, { sender: myName, text, timestamp: Date.now() }]);
  }, [myName]);

  if (screen === 'lobby') {
    return <Lobby onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} error={error} />;
  }

  if (screen === 'waiting') {
    return <WaitingRoom roomId={roomId} playerName={myName} />;
  }

  return (
    <Game
      game={game}
      myPlayerNumber={myPlayerNumber}
      myName={myName}
      onRollDice={handleRollDice}
      onActionDone={handleActionDone}
      onDrawEventCard={handleDrawEventCard}
      onSendChat={handleSendChat}
      chatMessages={chatMessages}
      rolling={rolling}
      lastMove={lastMove}
    />
  );
}
