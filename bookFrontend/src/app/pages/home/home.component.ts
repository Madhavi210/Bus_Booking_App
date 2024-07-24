import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BusService } from 'src/app/core/services/bus/bus.service';
import { IBus } from 'src/app/core/interface/bus.interface';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  searchForm!: FormGroup;
  buses: IBus[] = [];
  totalBuses: number = 0;

  constructor(
    private fb: FormBuilder,
    private busService: BusService,
    private router: Router ,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.fetchAllBuses(); // Fetch all buses on initialization
  }

  initializeForm(): void {
    this.searchForm = this.fb.group({
      date: [''],
      startingStop: [''],
      endingStop: ['']
    });
  }

  fetchAllBuses(page: number = 1, limit: number = 10): void {
    this.busService.getAllBuses(page, limit).subscribe(
      (data) => {
        console.log(data); // Log response for debugging
        this.buses = data.data.buses;
        this.totalBuses = data.data.totalBuses;
      },
      (error) => {
        console.error('Error fetching buses:', error);
      }
    );
  }

  onSearch(): void {
    const { date, startingStop, endingStop } = this.searchForm.value;
    this.busService.searchBuses(date, startingStop, endingStop).subscribe(
      (data) => {
        console.log(data); // Log response for debugging
        this.buses = data.data.buses;
        this.totalBuses = data.data.totalBuses;
      },
      (error) => {
        console.error('Error searching buses:', error);
      }
    );
  }

  onClear(): void {
    this.searchForm.reset();
    this.fetchAllBuses(); // Fetch all buses again when clearing the search
  }

  getAvailableSeatCount(seats: { isBooked: boolean }[]): number {
    return seats.filter(seat => !seat.isBooked).length;
  }

  viewBusDetails(busId: string): void {
    console.log('View details for bus with ID:', busId);
    this.router.navigate(['/home/busData', busId]);
  }
}
