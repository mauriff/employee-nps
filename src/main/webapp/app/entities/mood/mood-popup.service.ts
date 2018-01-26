import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Mood } from './mood.model';
import { MoodService } from './mood.service';

@Injectable()
export class MoodPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private moodService: MoodService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.moodService.find(id).subscribe((mood) => {
                    if (mood.date) {
                        mood.date = {
                            year: mood.date.getFullYear(),
                            month: mood.date.getMonth() + 1,
                            day: mood.date.getDate()
                        };
                    }
                    this.ngbModalRef = this.moodModalRef(component, mood);
                    resolve(this.ngbModalRef);
                });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.moodModalRef(component, new Mood());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    moodModalRef(component: Component, mood: Mood): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.mood = mood;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
