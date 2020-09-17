import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DomRoutingModule } from './dom-routing.module';

import { CreateComponent } from './create/create.component';
import { ClassComponent } from './manipulations/class/class.component';
import { AttrComponent } from './manipulations/attr/attr.component';
import { CssComponent } from './manipulations/css/css.component';
import { OnComponent } from './event-listener/on/on.component';
import { OffComponent } from './event-listener/off/off.component';
import { FilterComponent } from './traversings/filter/filter.component';
import { ForEachComponent } from './traversings/for-each/for-each.component';
import { IndexOfComponent } from './traversings/index-of/index-of.component';
import { HtmlComponent } from './manipulations/html/html.component';
import { AnimateComponent } from './animate/animate.component';

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
        IndexOfComponent,
        HtmlComponent,
        AnimateComponent
    ],
    imports: [
        CommonModule,
        DomRoutingModule
    ]
})
export class DomModule { }