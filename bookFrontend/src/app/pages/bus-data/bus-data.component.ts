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
        console.log(data);
        
      },
      (error) => {
        console.error('Error fetching bus details:', error);
      }
    );
  }

  bookNow(): void {
    this.router.navigate(['home/book/', this.busId]);
  }
}
