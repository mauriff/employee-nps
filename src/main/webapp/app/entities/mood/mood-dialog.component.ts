import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Mood } from './mood.model';
import { MoodPopupService } from './mood-popup.service';
import { MoodService } from './mood.service';

@Component({
    selector: 'jhi-mood-dialog',
    templateUrl: './mood-dialog.component.html'
})
export class MoodDialogComponent implements OnInit {

    mood: Mood;
    isSaving: boolean;
    dateDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private moodService: MoodService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.mood.id !== undefined) {
            this.subscribeToSaveResponse(
                this.moodService.update(this.mood));
        } else {
            this.subscribeToSaveResponse(
                this.moodService.create(this.mood));
        }
    }

    private subscribeToSaveResponse(result: Observable<Mood>) {
        result.subscribe((res: Mood) =>
            this.onSaveSuccess(res), (res: Response) => this.onSaveError());
    }

    private onSaveSuccess(result: Mood) {
        this.eventManager.broadcast({ name: 'moodListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }
}

@Component({
    selector: 'jhi-mood-popup',
    template: ''
})
export class MoodPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private moodPopupService: MoodPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.moodPopupService
                    .open(MoodDialogComponent as Component, params['id']);
            } else {
                this.moodPopupService
                    .open(MoodDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
