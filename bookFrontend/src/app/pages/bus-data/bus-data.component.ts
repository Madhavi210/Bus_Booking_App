import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusService } from 'src/app/core/services/bus/bus.service';
import { IBus } from 'src/app/core/interface/bus.interface';

@Component({
  selector: 'app-bus-data',
  templateUrl: './bus-data.component.html',
  styleUrls: ['./bus-data.component.scss']
})
export class BusDataComponent {
  busId!: string;
  bus!: IBus;
  rows: number[] = [];
  columns: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private busService: BusService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.busId = params.get('id')!;
      this.fetchBusDetails();
    });
  }

  fetchBusDetails(): void {
    this.busService.getBusById(this.busId).subscribe(
      (data) => {
        this.bus = data;
        this.rows = Array(this.bus.rows).fill(0).map((x, i) => i);
        this.columns = Array(this.bus.columns).fill(0).map((x, i) => i);        
      },
      (error) => {
        console.error('Error fetching bus details:', error);
      }
    );
  }

  bookNow(): void {
    this.router.navigate(['home/book/', this.busId]);
  }

  onSeatClick(row: number, col: number): void {
    const seatNumber = this.getSeatNumber(row, col);
    const seat = this.bus.seats.find(s => s.seatNumber === seatNumber);

    if (seat && !seat.isBooked) {
      this.router.navigate(['home/book/', this.busId, seatNumber]);
    }
  }

  isSeatBooked(row: number, col: number): boolean {
    const seatNumber = this.getSeatNumber(row, col);
    const seat = this.bus.seats.find(s => s.seatNumber === seatNumber);
    return seat ? seat.isBooked : false;
  }

  isSingleLadySeat(row: number, col: number): boolean {
    const seatNumber = this.getSeatNumber(row, col);
    const seat = this.bus.seats.find(s => s.seatNumber === seatNumber);
    return seat ? seat.isSingleLady : false;
  }


 getSeatGroups(): number[][] {
  const groups: number[][] = [];
  const columnsPerGroup = 2;
  let startIndex = 0;

  while (startIndex < this.columns.length) {
    const endIndex = Math.min(startIndex + columnsPerGroup, this.columns.length);
    groups.push(this.columns.slice(startIndex, endIndex));
    startIndex = endIndex;
  }

  return groups;
}

shouldAddAisle(colIndex: number, groupIndex: number): boolean {
  const columnsPerGroup = 2;
  return (colIndex + 1) % columnsPerGroup === 0 && colIndex + 1 < this.getSeatGroups()[groupIndex].length;
}


  getSeatNumber(row: number, col: number): number {
    return row * this.bus.columns + col + 1;
  }


}
