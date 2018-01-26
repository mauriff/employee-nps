import { BaseEntity } from './../../shared';

export class Mood implements BaseEntity {
    constructor(
        public id?: number,
        public mood?: string,
        public date?: any,
        public office?: string,
    ) {
    }
}
