import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MoodsSharedModule } from '../../shared';
import {
    MoodService,
    MoodPopupService,
    MoodComponent,
    MoodDetailComponent,
    MoodDialogComponent,
    MoodPopupComponent,
    MoodDeletePopupComponent,
    MoodDeleteDialogComponent,
    moodRoute,
    moodPopupRoute,
} from './';

const ENTITY_STATES = [
    ...moodRoute,
    ...moodPopupRoute,
];

@NgModule({
    imports: [
        MoodsSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        MoodComponent,
        MoodDetailComponent,
        MoodDialogComponent,
        MoodDeleteDialogComponent,
        MoodPopupComponent,
        MoodDeletePopupComponent,
    ],
    entryComponents: [
        MoodComponent,
        MoodDialogComponent,
        MoodPopupComponent,
        MoodDeleteDialogComponent,
        MoodDeletePopupComponent,
    ],
    providers: [
        MoodService,
        MoodPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MoodsMoodModule {}
