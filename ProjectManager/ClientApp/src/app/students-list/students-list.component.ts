import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTab } from '@angular/material/tabs';
import { SharedService } from 'src/app/modules/shared/sharedService';
import { StudentsService } from './students.service';
import { User } from '../Dto/User';

export enum Roles {
  Administrator,
  Teacher,
  Student
}

export interface AddDialogData {
  name: string;
  password: string;
}

export interface EditDialogData {
  name: string;
  role: number;
}

export interface DeleteDialogData {
  name: string;
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.scss']
})
export class StudentsListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private shared: SharedService,
    private studentsService: StudentsService, private dialog: MatDialog) { }

  users: User[] = [];
  roles: typeof Roles = Roles;
  disableButtons: boolean = false;
  dataSource = new MatTableDataSource<User>();
  displayedColumns: string[] = ['position', 'name', 'role', 'settings'];
  sortedData = this.users.slice();

  ngOnInit(): void {
    this.studentsService.getUsers().subscribe((data) => {
      this.users = data;
      this.dataSource = new MatTableDataSource(Array.from(this.users));
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },
      (error) => console.log(error));
    this.studentsService.getUserRole(this.shared.UserName).subscribe(role => {
      if (role != null) {
        if (Roles[role] == "Administrator") {
          this.disableButtons = false;
        } else {
          this.disableButtons = true;
        }
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  sortData(sort: Sort) {
    const data = this.users.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return compare(a.userName, b.userName, isAsc);
        case 'role': return compare(a.role, b.role, isAsc);
        default: return 0;
      }
    });
    this.dataSource = new MatTableDataSource(Array.from(this.sortedData));
    this.dataSource.paginator = this.paginator;
  }



  name: string = "";
  password: string = "";
  role: number = 0;
  public errors: string[] = [""];

  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddUserDialog, {
      width: '250px',
      data: { name: this.name, password: this.password }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        if (result.name && result.password) {

          this.auth.register(result.name, result.password).subscribe(() => {
            window.location.reload();
          }, (error: HttpErrorResponse) => {
            if (error.error instanceof Array) {
              this.errors = error.error.map(m => m.description);
            }
            else {
              this.errors = [error.error.message];
            }
            alert(this.errors.join("\n"));
          });
        } else {
          alert("You have to fill the fields");
        }
      }
    });
  }

  openDeleteDialog(user: string) {
    if (!this.disableButtons) {
      const dialogRef = this.dialog.open(DeleteUserDialog, {
        width: '250px',
        data: user
      });      
    }   
    
  }

  openEditDialog(user: string) {
    if (!this.disableButtons) {
      const dialogRef = this.dialog.open(EditUserDialog, {
        width: '250px',
        data: { name: user, role: this.role }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result.name && result.role) {
            const roleIndex: number = Object.keys(Roles).indexOf(result.role);
            this.studentsService.updateRole(user, roleIndex).subscribe(() => {
              window.location.reload();
            }, (error: HttpErrorResponse) => {
              if (error.error instanceof Array) {
                this.errors = error.error.map(m => m.description);
              }
              else {
                this.errors = [error.error.message];
              }
              alert(this.errors.join("\n"));
            });
          }
        }
      });
    }
  }
}

@Component({
  selector: 'add-user-dialog',
  templateUrl: 'add-user-dialog.html',
})
export class AddUserDialog {

  constructor(
    private dialogRef: MatDialogRef<AddUserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AddDialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'delete-user-dialog',
  templateUrl: 'delete-user-dialog.html',
})
export class DeleteUserDialog {
  public errors: string[] = [""];

  constructor(private studentsService: StudentsService,
    private dialogRef: MatDialogRef<DeleteUserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: string) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  removeUser(user: string) {
   
    this.dialogRef.close();
    if (user) {
      this.studentsService.deleteUser(user).subscribe(() => {
        window.location.reload();
      }, (error: HttpErrorResponse) => {
        if (error.error instanceof Array) {
          this.errors = error.error.map(m => m.description);
        }
        else {
          this.errors = [error.error.message];
        }
        alert(this.errors.join("\n"));
      });
    } else {
      alert("User not found");
    }
  }

}

@Component({
  selector: 'edit-user-dialog',
  templateUrl: 'edit-user-dialog.html',
})
export class EditUserDialog {

  roles = Roles;
  keys: string[] = [];

  constructor(
    private dialogRef: MatDialogRef<EditUserDialog>,
    @Inject(MAT_DIALOG_DATA) public data: EditDialogData,
    private studentsService: StudentsService) {
    this.keys = Object.keys(this.roles).filter(k => !isNaN(Number(k)));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
