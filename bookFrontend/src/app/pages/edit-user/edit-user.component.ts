
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/core/services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  editForm!: FormGroup;
  userId: string | null = null;
  existingProfilePic: string | null = null;
  selectedFile: File | null = null;
  isEditMode: boolean = false;
  passwordFieldType: string = 'password';


  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['user', Validators.required],
      profilePic: ['', Validators.required],
    });
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('id');
      this.isEditMode = !!this.userId; 
    });
    if (this.userId && this.isEditMode) {
      this.loadUserData(this.userId);
    }
  }

  loadUserData(userId: string): void {
    this.userService.getUserById(userId).subscribe(
      (user) => {
        this.editForm.patchValue({
          name: user.name,
          email: user.email,
          role: user.role,
        });

        this.existingProfilePic = user.profilePic
          ? `http://localhost:3000/uploads/${user.profilePic.split('\\').pop()}`
          : null;
      },
      (error) => {
        console.error(error);
        this.router.navigate(['/admin']);
      }
    );
  }

  onSubmit() {
    if (this.editForm.valid) {
      const formData = new FormData();

      formData.append('name', this.editForm.get('name')?.value);
      formData.append('email', this.editForm.get('email')?.value);
      formData.append('password', this.editForm.get('password')?.value);
      formData.append('role', this.editForm.get('role')?.value);
      
      if (this.selectedFile) {
        formData.append('profilePic', this.selectedFile);
      } else {
        formData.append('profilePic', this.existingProfilePic || '');
      }

      if (this.userId && this.isEditMode) {
        this.userService.updateUser(this.userId, formData).subscribe(
          (response)=>{            
            Swal.fire('Success', 'User updated successfully', 'success'); //this is printed but not updating
            this.router.navigate(['/admin']);
          },
          (error) => {
            if (error.status === 409) {
              console.error(error);
            } else {
              console.error(error);
            }
          }
        )
      } else {
        //add user 
        this.userService.createUser(formData).subscribe(
          (response) => {
            Swal.fire('Success', 'User created successfully', 'success');
            this.router.navigate(['/admin']); // Navigate to the admin user list or any other appropriate route
          },
          (error) => {
            if (error.status === 409) {
              console.error(error);
            } else {
              console.error(error);
            }
          }
        );
      }
    } else {
      this.editForm.markAllAsTouched();
      return;
    }
  }


  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]; // Store the selected file
      // this.editForm.patchValue({
      //   profilePic: this.selectedFile // Update form value if necessary
      // });
    }
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }
  
}