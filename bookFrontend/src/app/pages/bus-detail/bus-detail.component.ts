import { Component, OnInit } from '@angular/core';
import { BusService } from 'src/app/core/services/bus/bus.service';
import { IBus } from 'src/app/core/interface/bus.interface';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
@Component({
  selector: 'app-bus-detail',
  templateUrl: './bus-detail.component.html',
  styleUrls: ['./bus-detail.component.scss']
})
export class BusDetailComponent implements OnInit {
  searchForm!: FormGroup;
  buses: IBus[] = [];
  totalBuses: number = 0;

  constructor(
    private fb: FormBuilder,
    private busService: BusService,
    private router: Router ,
    private locationService: Location
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

  editBusDetails(busId: string): void {
    console.log('View details for bus with ID:', busId);
    this.router.navigate(['/admin/edit-bus', busId]);
  }

  
  deleteBusDetails(busId: string): void {
    console.log('View details for bus with ID:', busId);
  
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with deletion if confirmed
        this.busService.deleteBus(busId).subscribe(
          response => {
            this.fetchAllBuses();
            Swal.fire('Deleted!', 'Bus has been deleted.', 'success');
          },
          error => {
            console.error('Error deleting bus:', error.message, error);
            Swal.fire('Error', 'There was an error deleting the bus.', 'error');
          }
        );
      }
    });
  }

  goBack(){
    // this.locationService.back();
    this.router.navigate(['/admin'])
  }
}