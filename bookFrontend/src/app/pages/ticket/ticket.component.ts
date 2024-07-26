import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from 'src/app/core/services/ticket/ticket.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {
  pnrNumber: string = '';
  bookingDetails: any = {};
  ticket: any;
  bookingId!: string ;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService,
    private router: Router,  
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.bookingId = params.get('id')!;
      console.log(this.bookingId);

      if (this.bookingId) {
        this.loadTicket();
      } else {
        console.error('Booking ID is undefined in route parameters.');
      }
    });
  }

  private loadTicket(): void {
    this.ticketService.getTicket(this.bookingId).subscribe(
      (data) => {
        console.log(data);
        
        this.ticket = data;
        this.pnrNumber = this.ticket.pnrNumber;
        console.log(this.pnrNumber, this.ticket);
         
      },
      (error) => {
        console.error('Error fetching ticket:', error);
      }
    );
  }

}
