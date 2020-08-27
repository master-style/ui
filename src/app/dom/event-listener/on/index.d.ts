interface Element {
    on(typeSet: string, factor: string, handle: (event: Event, ...detail: any) => any, option?: Master.ListenerOption): this;
    on(typeSet: string, handle: (event: Event, ...detail: any) => any, option?: Master.ListenerOption): this;
}
interface Window extends Pick<Element, 'on'> { }
interface Document extends Pick<Element, 'on'> { }