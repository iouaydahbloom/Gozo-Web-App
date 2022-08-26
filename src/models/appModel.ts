export default abstract class AppModel {
    static getFromDTO: (dto: any) => AppModel;
    abstract toDTO: () => any;
}