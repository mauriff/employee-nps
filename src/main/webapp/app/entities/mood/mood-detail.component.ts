import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { Mood } from './mood.model';
import { MoodService } from './mood.service';

@Component({
    selector: 'jhi-mood-detail',
    templateUrl: './mood-detail.component.html'
})
export class MoodDetailComponent implements OnInit, OnDestroy {

    mood: Mood;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private moodService: MoodService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInMoods();
    }

    load(id) {
        this.moodService.find(id).subscribe((mood) => {
            this.mood = mood;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInMoods() {
        this.eventSubscriber = this.eventManager.subscribe(
            'moodListModification',
            (response) => this.load(this.mood.id)
        );
    }
}
