import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
import { Router} from "@angular/router";

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['../auth.styles.css']
})
export class ForgotComponent implements OnInit {

  constructor(public auth: AuthService,  public router: Router) { }

  ngOnInit() {
  }

  forgot(form: NgForm) {
    const email = form.value.email;
    this.auth.ForgotPassword(email);
  }
}