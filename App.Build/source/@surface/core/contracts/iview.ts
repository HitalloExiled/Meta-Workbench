export interface IView
{
    show(): void;
    hide(): void;
    onLoad:  (target: IView) => void;
    onClose: (target: IView) => void;
}