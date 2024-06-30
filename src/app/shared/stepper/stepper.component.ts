import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
interface Step {
  title: string;
  icon: string;
  fecha:  string;
}
@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss'
})
export class StepperComponent {
  @Input() steps: Step[] = [];
  @Input() currentStep: number = 0;

  constructor() {}

  ngOnInit(): void {}
}
