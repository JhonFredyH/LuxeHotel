
import { useContext } from 'react';
import { RoomContext } from '../context/RoomProvider';

export function useRooms() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRooms must be used within RoomProvider');
  }
  return context;
}