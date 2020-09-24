import { Element, Attr, ControlElement } from '@element';

import css from './index.scss';

const NAME = 'select';

@Element({
    tag: 'm-' + NAME,
    css
})
export class MasterSelect extends ControlElement {

    @Attr({ key: 'tabindex' })
    tabIndex = -1;

    readonly #options = [];

    get options() {
        return this.#options;
    }

    add(option) {
        this.#options.push(option);
        this.updateValue();
    }

    delete(option) {
        this.#options.splice(this.#options.indexOf(option), 1);
    }

    updateValue() {
        if (this.multiple) {
            // value and oldValue always not be same
            this.value = this.#options
                .filter((eachOption) => eachOption.selected)
                .map((eachOption) => eachOption.value);
        } else {
            this.value = this.#options
                .find((eachOption) => eachOption.selected);
        }
    }

    controlTemplate = $(() => [
        'input', {
            'aria-hidden': true,
            tabindex: -1,
            name: this.name,
            required: this.required,
            $created: (element: HTMLInputElement) => {
                this.body = element;
                this.validity = element.validity;
            }
        }
    ]);

    template = $(() => [
        'slot',
        'div', {
            part: 'body',
            placeholder: this.placeholder,
            label: this.label, // for default select width
            $text: this.value
        },
        'm-icon', { name: 'unfold' },
        'fieldset', [
            'legend', [
                'span', { $text: this.label }
            ]
        ],
        'label', { $text: this.label }
    ]);

    @Attr({ observe: false, render: false })
    empty: boolean;

    @Attr({ observe: false, render: false })
    role: string = 'listbox';

    @Attr({ key: 'readonly' })
    readOnly: boolean;

    @Attr()
    placeholder: string;

    @Attr()
    label: string;

    @Attr()
    multiple: boolean;

    @Attr({ render: false })
    expanded: boolean;

    @Attr({
        updater(select: MasterSelect, value: any) {
            ControlElement.valueUpdater(select, value);
        },
        reflect: false
    })
    value: any;

    @Attr()
    autocomplete: string;

    onAdded() {
        super.onAdded();
    }

}
