import { CubeSpinnerComponent } from './cube-spinner/cube-spinner.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    declarations: [
        CubeSpinnerComponent,
    ],
    imports: [
        CommonModule,
        MatProgressBarModule,
        MatBottomSheetModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
    ],
    exports: [
        CubeSpinnerComponent
    ]
})
export class SharedModule { }
