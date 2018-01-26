/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils, JhiDataUtils, JhiEventManager } from 'ng-jhipster';
import { MoodsTestModule } from '../../../test.module';
import { MockActivatedRoute } from '../../../helpers/mock-route.service';
import { MoodDetailComponent } from '../../../../../../main/webapp/app/entities/mood/mood-detail.component';
import { MoodService } from '../../../../../../main/webapp/app/entities/mood/mood.service';
import { Mood } from '../../../../../../main/webapp/app/entities/mood/mood.model';

describe('Component Tests', () => {

    describe('Mood Management Detail Component', () => {
        let comp: MoodDetailComponent;
        let fixture: ComponentFixture<MoodDetailComponent>;
        let service: MoodService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [MoodsTestModule],
                declarations: [MoodDetailComponent],
                providers: [
                    JhiDateUtils,
                    JhiDataUtils,
                    DatePipe,
                    {
                        provide: ActivatedRoute,
                        useValue: new MockActivatedRoute({id: 123})
                    },
                    MoodService,
                    JhiEventManager
                ]
            }).overrideTemplate(MoodDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(MoodDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(MoodService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
            // GIVEN

            spyOn(service, 'find').and.returnValue(Observable.of(new Mood(10)));

            // WHEN
            comp.ngOnInit();

            // THEN
            expect(service.find).toHaveBeenCalledWith(123);
            expect(comp.mood).toEqual(jasmine.objectContaining({id: 10}));
            });
        });
    });

});
