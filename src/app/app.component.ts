import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Employee, EmployeeService } from './employee.service';
 
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="padding: 20px; font-family: Arial; max-width: 800px; margin: auto;">
      <h2>Employee Management (Spring Boot + Angular)</h2>

      <!-- Form for Add / Update --> 
      <form (ngSubmit)="saveEmployee()" style="margin-bottom: 20px; background: #f4f4f4; padding: 15px; border-radius: 5px;">
        <h3>{{ isEditMode ? 'Edit Employee' : 'Add Employee' }}</h3>
        <input type="text" [(ngModel)]="currentEmployee.name" name="name" placeholder="Name" required                   style="margin-right: 10px; padding: 5px;" />
        <input type="email" [(ngModel)]="currentEmployee.email" name="email" placeholder="Email" required               style="margin-right: 10px; padding: 5px;" />
        <input type="text" [(ngModel)]="currentEmployee.department" name="department" placeholder="Department" required style="margin-right: 10px; padding: 5px;" />
        <input type="text" [(ngModel)]="currentEmployee.phoneno" name="phoneno" placeholder="Phone No" required          style="margin-right: 10px; padding: 5px;" />
         
        <button type="submit" style="padding: 6px 12px; background: green; color: white; border: none; cursor: pointer;">
          {{ isEditMode ? 'Update' : 'Save' }}
        </button>
        <button type="button" (click)="resetForm()" *ngIf="isEditMode" style="margin-left: 5px; padding: 6px 12px; cursor: pointer;">Cancel</button>
      </form>

      <!-- Data Table -->
      <table border="1" cellpadding="10" cellspacing="0" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #ddd;">
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Phone No</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let emp of employees">
            <td>{{ emp.id }}</td>
            <td>{{ emp.name }}</td>
            <td>{{ emp.email }}</td>
            <td>{{ emp.department }}</td>
             <td>{{ emp.phoneno }}</td>
            <td>
              <button (click)="editEmployee(emp)" style="margin-right: 5px; background: orange; border: none; padding: 4px 8px; cursor: pointer;">Edit</button>
              <button (click)="deleteEmployee(emp.id!)" style="background: red; color: white; border: none; padding: 4px 8px; cursor: pointer;">Delete</button>
            </td>
          </tr>
          <tr *ngIf="employees.length === 0">
            <td colspan="5" style="text-align: center;">No employees found.</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class AppComponent implements OnInit {
  employees: Employee[] = [];
  currentEmployee: Employee = { name: '', email: '', department: '',phoneno: ''};
  isEditMode = false;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getEmployees().subscribe(data => {
      this.employees = data;
    });
  }

  saveEmployee() {
    if (this.isEditMode && this.currentEmployee.id) {
      this.employeeService.updateEmployee(this.currentEmployee.id, this.currentEmployee).subscribe(() => {
        this.loadEmployees();
        this.resetForm();
      });
    } else {
      this.employeeService.createEmployee(this.currentEmployee).subscribe(() => {
        this.loadEmployees();
        this.resetForm();
      });
    }
  }

  editEmployee(emp: Employee) {
    this.currentEmployee = { ...emp };
    this.isEditMode = true;
  }

  deleteEmployee(id: number) {
    if (confirm('Are you sure you want to delete?')) {
      this.employeeService.deleteEmployee(id).subscribe(() => {
        this.loadEmployees();
      });
    }
  }

  resetForm() {
    this.currentEmployee = { name: '', email: '', department: '' ,phoneno:''};
    this.isEditMode = false;
  }
}