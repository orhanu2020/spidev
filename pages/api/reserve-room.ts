type ReservationRequest = {
    wagonIndex: number;
    roomNumber: number;
  };
  
  type ResponseData = {
    message: string;
  };
  
  const wagons: boolean[][] = Array.from({ length: 30 }, () => Array(20).fill(false)); // Each wagon has 20 rooms, initially unreserved
  
  export default function handler(req: { method: string; body: ReservationRequest }, res: { status: (arg0: number) => { json: { (arg0: ResponseData): void; (arg0: { message: string }): void; }; }; }) {
 // export default function handler(req: { method: string; body: ReservationRequest }, res: { status: (arg0: number) => { (): any; new (): any; json: { (arg0: ResponseData): void; (arg0: { message: string }): void; }; }; }) {
    const { method } = req;
    
    if (method === 'POST') {
      const { wagonIndex, roomNumber } = req.body;
  
      // Validate room selection
    //   if (wagons[wagonIndex][roomNumber - 1]) {
    //     return res.status(400).json({ message: 'Room already reserved' });
    //   }
  
      // Mark the room as reserved
      wagons[wagonIndex][roomNumber - 1] = true;
      return res.status(200).json({ message: 'Room reserved successfully' });
    } else if (method === 'GET') {
        const { wagonIndex, roomNumber } = req.body;
    
        // Validate room selection
        if (wagons[wagonIndex][roomNumber - 1]) {
          return res.status(400).json({ message: 'Room already reserved' });
        }
        return res.status(200).json({ message: 'Room reserved successfully' });
      }

    
  
    res.status(405).json({ message: 'Method Not Allowed' });
  }