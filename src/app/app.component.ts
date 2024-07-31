import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  toggleDarkMode(): void {
    document.documentElement.classList.toggle('dark');
    document.documentElement.classList.toggle('light');
  }

  changePrimaryColor(): void {
    if (
      document.documentElement.style.getPropertyValue('--primary-color') ===
      '#f5a65f'
    ) {
      document.documentElement.style.setProperty('--primary-color', '#f00');
    } else {
      document.documentElement.style.setProperty('--primary-color', '#f5a65f');
    }
  }
}
