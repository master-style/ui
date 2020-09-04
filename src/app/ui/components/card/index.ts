import { Element, Attr } from '@element';
import css from './index.scss';

const NAME = 'card';

@Element({
    tag: 'm-' + NAME,
    css
})
export class MasterCard extends HTMLElement {

    template = $(() => [
        (this.href && !this.disabled) ? 'a' : 'button', {
            part: 'shadow',
            href: this.href,
            target: this.target,
            disabled: this.disabled,
            download: this.download,
            type: this.type
        }, [
            'slot', { name: 'head' },
            'slot', { name: 'body' },
            'slot', { name: 'foot' }
        ]
    ]);

    @Attr({ render: true })
    type: string;

    @Attr({ render: true })
    rel: string;

    @Attr({ render: true })
    href: string;

    @Attr({ render: true })
    disabled: boolean;

    @Attr()
    loading: boolean;

    @Attr({ render: true })
    download: number;

    @Attr({ render: true })
    target: string;

    render() {
        this.template.render(this.shadowRoot);
    }
}
