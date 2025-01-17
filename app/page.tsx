"use client"


import { Accordion, AccordionSummary, AccordionDetails, Button, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styled from 'styled-components';
import { useState } from 'react';

const TrainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: #f0f4f8;
  min-height: 100vh;
  justify-content: center;
`;


const WagonSummary = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`;

const RoomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 2 columns */
  gap: 10px; /* Space between buttons */
  width: 100%; /* Full width for the grid */
`;

const ReservationApp = () => {
  const wagons = Array.from({ length: 30 }, (_, i) => i + 1);
  const roomsPerVagon = 20;

  // State to track selected rooms for each wagon
  const [selectedRooms, setSelectedRooms] = useState<number[]>(
    Array(wagons.length).fill(0) // Initialize all wagons with 0 selected rooms
  );

  // State to track selected rooms for each wagon's button
  const [selectedRoomsList, setSelectedRoomsList] = useState<boolean[][]>(
    Array(wagons.length).fill(Array(roomsPerVagon).fill(false)) // Array of arrays to track selected rooms per wagon
  );

  const [loading, setLoading] = useState<boolean>(false); // Loading state to show user feedback

  const reset = ()=> {
    setSelectedRooms(Array(wagons.length).fill(0))
    setSelectedRoomsList(Array(wagons.length).fill(Array(roomsPerVagon).fill(false)))
  }

  const handleRoomClick = async (wagonIndex: number, roomNumber: number) => {
   
    if (loading) return; // Prevent multiple clicks while loading

    setLoading(true);

    try {
      const response = await fetch('/api/reserve-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ wagonIndex, roomNumber }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.message);
        setLoading(false);
        return;
      }

      
      setSelectedRooms((prev) => {
        const updatedSelectedRooms = [...prev];
        updatedSelectedRooms[wagonIndex] += 1;
        return updatedSelectedRooms;
      });
  
      setSelectedRoomsList((prev) => {
        const updatedSelectedRoomsList = prev.map((wagon, index) =>
          index === wagonIndex
            ? wagon.map((room, rIndex) =>
                rIndex === roomNumber - 1 ? true : room
              )
            : wagon
        );
        return updatedSelectedRoomsList;
      });
    } catch (error) {
      alert('Error reserving room: '+ error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <TrainContainer>
      <Button onClick={() => reset()}>Reset</Button>
      {wagons.map((wagonNumber, wagonIndex) => {
        const isFullyBooked = selectedRooms[wagonIndex] === roomsPerVagon;
        return (
          <Accordion key={wagonNumber}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`wagon${wagonNumber}-content`}
              id={`wagon${wagonNumber}-header`}
              style={{
                backgroundColor: isFullyBooked ? 'green' : 'transparent',
                color: isFullyBooked ? 'white' : 'inherit',
              }}
            >
              <WagonSummary>
                <Typography variant="h6">Bolum {wagonNumber}</Typography>
                <Typography variant="body2">
                  {selectedRooms[wagonIndex]} secili
                </Typography>
              </WagonSummary>
            </AccordionSummary>
            <AccordionDetails>
              <RoomGrid>
                {Array.from({ length: roomsPerVagon }, (_, roomNumber) => {
                  const isRoomSelected = selectedRoomsList[wagonIndex][roomNumber];
                  return (
                    <Button
                      key={roomNumber + 1}
                      variant="contained"
                      color={isRoomSelected ? 'success' : 'primary'}
                      onClick={() => handleRoomClick(wagonIndex, roomNumber + 1)}
                      disabled={isRoomSelected || isFullyBooked}
                    >
                      Sayfa {roomNumber + 1}
                    </Button>
                  );
                })}
              </RoomGrid>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </TrainContainer>
  );
};

export default ReservationApp;