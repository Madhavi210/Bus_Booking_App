
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user/user.service';
import { IUser } from 'src/app/core/interface/user.interface';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/core/services/login/login.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-userdetail',
  templateUrl: './userdetail.component.html',
  styleUrls: ['./userdetail.component.scss']
})
export class UserDetailComponent implements OnInit {

  users: any[] = [];
  profilePicUrl: SafeResourceUrl[] = [];
  filteredUsers: any[] = [];
  searchForm!: FormGroup; 

  constructor(
    private userService:UserService,
    private loginService:LoginService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private fb: FormBuilder
  ){
   
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      searchTerm: [''] 
    });
    this.fetchAllUser();
    this.filteredUsers = this.users
  }

  fetchAllUser():void {
    this.userService.getAllUsers().subscribe(
      data => {        
        this.users = data.users; 
        
        this.profilePicUrl = [];
        this.users.forEach(user => {          
          if(user.profilePic) {            
            const filename = user.profilePic.split('\\').pop();
            const fullUrl = `http://localhost:3000/uploads/${filename}`;
            const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
            this.profilePicUrl.push(safeUrl);
          } else {
            this.profilePicUrl.push('');
          }
        });

        this.applySearchFilter();
      },
      error => {
        console.error('Error fetching users:', error);
      }
    );
  }

  applySearchFilter(): void {
    this.filteredUsers = this.users.filter((user: any) => {
    const searchTerm = this.searchForm.value.searchTerm;
    if (searchTerm && searchTerm.trim()) {
      return user.name.toLowerCase().includes(searchTerm.trim().toLowerCase());
    }
    return true;
  });
  }

  editUser(userId: string): void {
    this.router.navigate(['admin/edit-user/', userId]);
  }

  deleteUser(userId: string): void {
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
        this.userService.deleteUser(userId).subscribe(
          () => {
            this.fetchAllUser(); 
            Swal.fire('Deleted!', 'User has been deleted.', 'success');
          },
          error => {
            console.error('Error deleting user:', error.message, error);
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
    this.applySearchFilter();
  }

}