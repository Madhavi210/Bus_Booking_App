import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user/user.service';
import { BusService } from 'src/app/core/services/bus/bus.service';
import { RouteService } from 'src/app/core/services/route/route.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  totalUsers: number = 0;
  totalBuses: number = 5;
  totalRoutes: number = 5;
  
    // Pie chart data
    public pieChartData: number[] = [];
    public pieChartLabels: string[] = ['Total Users', 'Total Buses', 'Total Routes'];
    pieChart?: Chart<'pie', number[], string>;
  
  constructor(private userService: UserService, 
    private busservice:BusService,
    private routeservice: RouteService,
  ){}

  ngOnInit(): void {
      this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.userService.getAllUsers().subscribe(
      (data) => {
        this.totalUsers = data.totalUser; // Ensure `totalUsers` matches your API response
        console.log(this.totalUsers);
        
        // this.updateChart();
      },
      (error) => console.error('Error fetching total users:', error)
    );
    this.busservice.getAllBuses().subscribe(
      (data) => {
        this.totalBuses = data.totalBuses; // Ensure `totalBuses` matches your API response
        console.log(this.totalBuses);
        
        // this.updateChart();
      },
      (error) => console.error('Error fetching total buses:', error)
    );
    this.routeservice.getAllRoutes().subscribe(
      (data) => {
        this.totalRoutes = data.totalRoutes; // Ensure `totalRoutes` matches your API response
        console.log(this.totalRoutes);
        
        // this.updateChart();
      },
      (error) => console.error('Error fetching total routes:', error)
    );
    this.updateChart();
  }



  private updateChart(): void {
    this.pieChartData = [this.totalUsers, this.totalBuses, this.totalRoutes];

    const ctx = document.getElementById('myPieChart') as HTMLCanvasElement;
    if (ctx) {
      this.pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.pieChartLabels,
          datasets: [{
            label: 'Dashboard Overview',
            data: this.pieChartData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.8)',
              'rgba(54, 162, 235, 0.8)',
              'rgba(255, 206, 86, 0.8)'
            ],
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              enabled: true,
            }
          }
        }
      });
    }
  }


}

