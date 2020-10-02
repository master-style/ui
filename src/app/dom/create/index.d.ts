
export { }

declare global {
    interface Master {
        <T extends Element>(selector: string, attributes: { [key: string]: any }, ...children: (Element | string)[]): T;
        (selector: string): NodeList;
        (template: () => Array<any>): MasterTemplate;
    }

    interface TemplateNode {
        tag: string;
        attributes?: { [key: string]: any };
        children?: TemplateNode[];
        element?: any;
        attr?: any;
        $html?: string;
        $text?: string;
        $if?: boolean;
        $css?: { [key: string]: any };
        $namespace?: string;
        $created?: <T extends Element>(element?: T, node?: TemplateNode) => void;
        $removed?: <T extends Element>(element?: T, node?: TemplateNode) => void;
        $updated?: <T extends Element>(element?: T, node?: TemplateNode) => void;
        $data?: any;
    }
}
