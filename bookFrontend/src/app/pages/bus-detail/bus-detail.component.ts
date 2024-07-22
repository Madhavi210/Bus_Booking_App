import { Component, OnInit } from '@angular/core';
import { BusService } from 'src/app/core/services/bus/bus.service';
import { IBus } from 'src/app/core/interface/bus.interface';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-bus-detail',
  templateUrl: './bus-detail.component.html',
  styleUrls: ['./bus-detail.component.scss']
})
export class BusDetailComponent implements OnInit {

  buses: IBus[] = [];
  filteredBuses: IBus[] = [];
  searchForm!: FormGroup;

  constructor(
    private busService: BusService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
    this.fetchAllBuses();
  }

  fetchAllBuses(): void {
    this.busService.getAllBuses().subscribe(
      data => {
        this.buses = data.buses;
        this.filteredBuses = this.buses;
      },
      error => {
        console.error('Error fetching buses:', error);
      }
    );
  }

  applySearchFilter(): void {
    const searchTerm = this.searchForm.value.searchTerm;
    this.filteredBuses = this.buses.filter(bus =>
      bus.busNumber.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  }

  editBus(busId: string): void {
    this.router.navigate(['admin/edit-bus/', busId]);
  }

  deleteBus(busId: string): void {
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
        this.busService.deleteBus(busId).subscribe(
          () => {
            this.fetchAllBuses();
            Swal.fire('Deleted!', 'Bus has been deleted.', 'success');
          },
          error => {
            console.error('Error deleting bus:', error.message, error);
          }
        );
      }
    });
  }

  onSearch(): void {
    this.applySearchFilter();
  }

  onClear(): void {
    this.searchForm.reset();
    // this.applySearchFilter();
    this.fetchAllBuses();
  }
}