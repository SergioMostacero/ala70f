import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-flight',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-flight.component.html',
  styleUrls: ['./register-flight.component.scss']
})
export class RegisterFlightComponent {
  public crewMembers: { name: string; rank: string }[] = [];

  constructor(private router: Router) {}

  addCrewMember() {
    this.crewMembers = [...this.crewMembers, { name: '', rank: '' }];
  }

  removeCrewMember(index: number) {
    this.crewMembers.splice(index, 1);
  }


  goBack() {
    this.router.navigate(['/home']);
  }
}
