import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DomRoutingModule } from './dom-routing.module';

import { ClassComponent } from './manipulations/class/class.component';
import { AttrComponent } from './manipulations/attr/attr.component';
import { CreateComponent } from './manipulations/create/create.component';
import { CssComponent } from './manipulations/css/css.component';
import { OnComponent } from './event-listener/on/on.component';
import { OffComponent } from './event-listener/off/off.component';
import { FilterComponent } from './traversings/filter/filter.component';
import { ForEachComponent } from './traversings/for-each/for-each.component';
import { IndexOfComponent } from './traversings/index-of/index-of.component';

@NgModule({
    declarations: [
        ClassComponent,
        AttrComponent,
        CreateComponent,
        CssComponent,
        OnComponent,
        OffComponent,
        FilterComponent,
        ForEachComponent,
        IndexOfComponent
    ],
    imports: [
        CommonModule,
        DomRoutingModule
    ]
})
export class DomModule { }