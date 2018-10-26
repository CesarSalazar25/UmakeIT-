import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-extras-checkbox',
  templateUrl: './extras-checkbox.component.html',
  styleUrls: ['./extras-checkbox.component.css']
})
export class ExtrasCheckboxComponent implements OnInit {
  @Input() extra;
  @Output() ExtraChange: EventEmitter<boolean>;

  constructor() { 
    this.ExtraChange = new EventEmitter();
  }

  ngOnInit() {
  }
  checkboxChanged(){
  this.ExtraChange.emit(!this.extra.anadido)
  }
}
