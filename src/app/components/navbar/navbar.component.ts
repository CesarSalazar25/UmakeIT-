import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  
  navbarOpen = false;

  toggleNavbar()
  {
    this.navbarOpen = !this.navbarOpen;
  }

  constructor(public auth: AuthService) 
  { 

  }

  ngOnInit() {
  }

}
