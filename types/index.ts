// types/index.ts
export interface Room {
    number: number;
    isReserved: boolean;
    isLocked: boolean;
  }
  
  export interface TrainData {
    vagonNumber: number;
    rooms: Room[];
  }

  export let trainData: TrainData[] = Array.from({ length: 30 }, (_, vagonIndex) => ({
    vagonNumber: vagonIndex + 1,
    rooms: Array.from({ length: 20 }, (_, roomIndex) => ({
      number: roomIndex + 1,
      isReserved: false,
      isLocked: false,
    })),
  }));