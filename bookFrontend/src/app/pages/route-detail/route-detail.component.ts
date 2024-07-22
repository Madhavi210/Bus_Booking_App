import { Component, OnInit } from '@angular/core';
import { RouteService } from 'src/app/core/services/route/route.service';
import { IRoute } from 'src/app/core/interface/route.interface';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-route-detail',
  templateUrl: './route-detail.component.html',
  styleUrls: ['./route-detail.component.scss']
})
export class RouteDetailComponent implements OnInit {

  routes: IRoute[] = [];
  filteredRoutes: IRoute[] = [];
  searchForm!: FormGroup;

  constructor(
    private routeService: RouteService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
    this.fetchAllRoutes();
  }

  fetchAllRoutes(): void {
    this.routeService.getAllRoutes().subscribe(
      data => {
        this.routes = data.routes;
        this.filteredRoutes = this.routes;
      },
      error => {
        console.error('Error fetching routes:', error);
      }
    );
  }

  applySearchFilter(): void {
    const searchTerm = this.searchForm.value.searchTerm;
    this.filteredRoutes = this.routes.filter(route =>
      route._id.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  }

  editRoute(routeId: string): void {
    this.router.navigate(['admin/edit-route/', routeId]);
  }

  deleteRoute(routeId: string): void {
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
        this.routeService.deleteRoute(routeId).subscribe(
          () => {
            this.fetchAllRoutes();
            Swal.fire('Deleted!', 'Route has been deleted.', 'success');
          },
          error => {
            console.error('Error deleting route:', error.message, error);
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
    this.fetchAllRoutes();
  }
}
