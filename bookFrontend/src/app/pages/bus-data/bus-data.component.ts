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
  // columns: number[] = [];
  columns: number[] = Array(4).fill(0);

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
      (data: any) => {
        this.bus = data.data;
        const totalSeats = this.bus.seatingCapacity;
        const seatsPerRow = this.columns.length;
        this.rows = Array(Math.ceil(totalSeats / seatsPerRow)).fill(0).map((_, i) => i);
      },
      (error) => {
        console.error('Error fetching bus details:', error);
      }
    );
  }


  onSeatClick(row: number, col: number): void {
    const seatNumber = this.getSeatNumber(row, col);
    const seat = this.bus.seats.find(s => s.seatNumber === seatNumber);
    if (seat && !seat.isBooked) {
      this.router.navigate(['home/book', this.busId, seatNumber]);
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

  getSeatNumber(row: number, col: number): number {
    return row * this.columns.length + col + 1;
  }



}
