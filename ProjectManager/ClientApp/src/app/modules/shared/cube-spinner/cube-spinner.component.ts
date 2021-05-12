import { Component, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'app-cube-spinner',
    templateUrl: './cube-spinner.component.html',
    styleUrls: ['./cube-spinner.component.scss']
})
export class CubeSpinnerComponent implements OnChanges {

    @Input()
    public show = true;

    @Input()
    public outside = false;

    public fadeIn = false;
    public fadeOut = false;
    public spin = false;
    public showContainer = false;

    public ngOnChanges(): void {
        if (this.show) {
            this.runFadeInSpinnerAnimation();
        } else {
            this.runFadeOutAnimation();
        }
    }

    private runFadeInSpinnerAnimation(): void {
        this.showContainer = true;
        this.fadeIn = true;
        this.spin = true;
        setTimeout(() => this.fadeIn = false, 700);
    }

    private runFadeOutAnimation(): void {
        this.fadeOut = true;
        this.spin = false;
        setTimeout(() => {
            this.fadeOut = false;
            this.showContainer = false;
        }, 700);
    }

}
