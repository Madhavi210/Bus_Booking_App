import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BusService } from 'src/app/core/services/bus/bus.service';
import { Router } from '@angular/router';
import { IBus } from 'src/app/core/interface/bus.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  searchForm!: FormGroup;
  buses: IBus[] = [];
  filteredBuses: IBus[] = [];

  constructor(
    private fb: FormBuilder,
    private busService: BusService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchAllBuses();
    this.searchForm = this.fb.group({
      searchTerm: [''],
    });
  }

  fetchAllBuses(): void {
    this.busService.getAllBuses().subscribe(
      (data) => {
        this.buses = data.buses;
        this.filteredBuses = this.buses; 
      },
      (error) => {
        console.error('Error fetching buses:', error);
      }
    );
  }

  viewBusDetails(busId: string): void {
    this.router.navigate(['home/busData/', busId]);
  }

  applySearchFilter(): void {
    const searchTerm = this.searchForm.value.searchTerm;
    this.filteredBuses = this.buses.filter((bus) =>
      bus.busNumber.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  }

  onSearch(): void {
    this.applySearchFilter();
  }

  onClear(): void {
    this.searchForm.reset();
    // this.fetchAllBuses();
    this.filteredBuses = this.buses;
  }
}
