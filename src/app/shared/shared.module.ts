import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import 
{
  AccordionModule, 
  AlertModule,
  ButtonsModule,
  CarouselModule,
  CollapseModule,
  DatepickerModule,
  BsDropdownModule,
  ModalModule,
  PaginationModule,
  PopoverModule,
  ProgressbarModule,
  RatingModule,
  SortableModule,
  TabsModule,
  TimepickerModule,
  TooltipModule,
  TypeaheadModule
} from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],

  exports: [
    AccordionModule, 
    AlertModule,
    ButtonsModule,
    CarouselModule,
    CollapseModule,
    DatepickerModule,
    BsDropdownModule,
    ModalModule,
    PaginationModule,
    PopoverModule,
    ProgressbarModule,
    RatingModule,
    SortableModule,
    TabsModule,
    TimepickerModule,
    TooltipModule,
    TypeaheadModule
  ],
  providers: []
})
export class SharedModule { }
