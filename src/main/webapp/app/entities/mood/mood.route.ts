import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, CanActivate } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { JhiPaginationUtil } from 'ng-jhipster';

import { MoodComponent } from './mood.component';
import { MoodDetailComponent } from './mood-detail.component';
import { MoodPopupComponent } from './mood-dialog.component';
import { MoodDeletePopupComponent } from './mood-delete-dialog.component';

export const moodRoute: Routes = [
    {
        path: 'mood',
        component: MoodComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'moodsApp.mood.home.title'
        },
        canActivate: [UserRouteAccessService]
    }, {
        path: 'mood/:id',
        component: MoodDetailComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'moodsApp.mood.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const moodPopupRoute: Routes = [
    {
        path: 'mood-new',
        component: MoodPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'moodsApp.mood.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'mood/:id/edit',
        component: MoodPopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'moodsApp.mood.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    },
    {
        path: 'mood/:id/delete',
        component: MoodDeletePopupComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'moodsApp.mood.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
