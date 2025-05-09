export class TestEntity {
    constructor(
        public readonly content: string,
        public readonly createdBy: string,
        public readonly createdAt: Date = new Date(),
    ){}
}