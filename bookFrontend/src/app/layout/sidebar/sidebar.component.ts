import { Component, OnInit ,ViewChild, TemplateRef} from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user/user.service'; // Adjust path as per your project structure
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/core/services/login/login.service';
import { NgbModal, NgbModalRef  } from '@ng-bootstrap/ng-bootstrap'; // Import NgbModal for modal functionality
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit{


  userId: string | null = null;
  userName: string | null = null;
  profilePicUrl: SafeResourceUrl | null = null;
  userRole: string | null = '';
  modalRef: NgbModalRef | null = null;
  editForm!: FormGroup;

  constructor(
    private userService: UserService,
    private loginService: LoginService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
    this.userRole = localStorage.getItem('role');
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      profilePic: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
    if (this.userId) {
      this.fetchUserData();
      this.loadUserData(this.userId);
    }
  }

  fetchUserData(): void {
    if (this.userId) {
    this.userService.getUserById(this.userId).subscribe(
      user => {
        this.userName = user.name;        
        if (user.profilePic) {          
          const filename = user.profilePic.split('\\').pop();
          const fullUrl = `http://localhost:3000/uploads/${filename}`;
          this.profilePicUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
        }        
      },
      error => {
        console.error('Error fetching user data:', error);
      }
    );
  } else {
    console.error('User ID is undefined or null');
    Swal.fire("error", "'User ID is undefined or null" , "error");
  }
}

loadUserData(userId: string): void {
  this.userService.getUserById(userId).subscribe(
    (user) => {
      this.userName = user.name;
      this.editForm.patchValue({
        name: user.name,
        email: user.email,
        password: '', 
      });
      if (user.profilePic) {
        const filename = user.profilePic.split('\\').pop();
        const fullUrl = `http://localhost:3000/uploads/${filename}`;
        this.profilePicUrl =
          this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
      }
    },
    (error) => {
      console.error('Error fetching user data:', error);
    }
  );
}

logout(): void {
  this.loginService.logout().subscribe(
    response => {
      Swal.fire("Success", "Logout Successfully", "success").then(() => {
        this.router.navigate(['/login']);
      });
    },
    error => {
      console.error(error);
    }
  );
}



open(content: any) {
  this.modalRef = this.modalService.open(content, { centered: true });
}

onSubmit() {
  if (this.editForm.valid) {
    const formData = new FormData();
    formData.append('name', this.editForm.get('name')?.value);
    formData.append('email', this.editForm.get('email')?.value);
    formData.append('password', this.editForm.get('password')?.value);
    if (this.editForm.get('profilePic')?.value) {
      formData.append('profilePic', this.editForm.get('profilePic')?.value);
    }

    if (this.userId) {
      this.userService.updateUser(this.userId, formData).subscribe(
        (response) => {
          Swal.fire('Success', 'User updated successfully', 'success');
          this.modalRef?.close();
          this.userName = this.editForm.get('name')?.value;
          const profilePicFile = this.editForm.get('profilePic')?.value;
          if (profilePicFile) {
            const filename = profilePicFile.name;
            const fullUrl = `http://localhost:3000/uploads/${filename}`;
            this.profilePicUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
          }
        },
        (error) => {
          console.error('Error updating user:', error);
        }
      );
    }
  } else {    
      this.editForm.markAllAsTouched();
      Swal.fire('Error', 'Invalid form data', 'error');
      return;
  }
}

onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.editForm.patchValue({ profilePic: input.files[0] });
  }
}

}