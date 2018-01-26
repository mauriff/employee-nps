import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Mood } from './mood.model';
import { MoodPopupService } from './mood-popup.service';
import { MoodService } from './mood.service';

@Component({
    selector: 'jhi-mood-delete-dialog',
    templateUrl: './mood-delete-dialog.component.html'
})
export class MoodDeleteDialogComponent {

    mood: Mood;

    constructor(
        private moodService: MoodService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.moodService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'moodListModification',
                content: 'Deleted an mood'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-mood-delete-popup',
    template: ''
})
export class MoodDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private moodPopupService: MoodPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.moodPopupService
                .open(MoodDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
