import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/core/services/user/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerForm!: FormGroup;
  passwordFieldType: string = 'password';

  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['user', Validators.required],
      profilePic: ['', Validators.required] 
    });
  }

  onSubmit() {
    if (this.registerForm.valid ) {
      const formData = new FormData();
      formData.append('name', this.registerForm.get('name')?.value);
      formData.append('email', this.registerForm.get('email')?.value);
      formData.append('password', this.registerForm.get('password')?.value);
      formData.append('role', this.registerForm.get('role')?.value);
      const profilePicFile = this.registerForm.get('profilePic')?.value;
      if (profilePicFile) {
        formData.append('profilePic', profilePicFile);
      }
      
      this.userService.createUser(formData).subscribe(
        (response) => {          
          Swal.fire('Success', 'Registration successful', 'success');
          this.router.navigate(['/login']);
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
    else {
      this.registerForm.markAllAsTouched();
      return;
    }
  }


  onFileChange(event: any): void {
    const file =( event.target as HTMLInputElement).files?.[0];
      this.registerForm.patchValue({
        profilePic: file
      });
    
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

}