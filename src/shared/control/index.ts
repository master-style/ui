import { MasterElement, Attr } from '@master/element';
import { capitalize } from '../../utils/capitalize';

const WHEN_ATTR_OPTIONS = { reflect: false, onUpdate: (control: ControlElement) => control.validate() };

export class ControlElement extends MasterElement {

    validity: ValidityState;

    assignee;

    @Attr({ render: false })
    emit: boolean;

    @Attr()
    busy: boolean;

    @Attr()
    name: string;

    @Attr()
    disabled: boolean;

    @Attr(WHEN_ATTR_OPTIONS)
    whenBadInput: string;

    @Attr(WHEN_ATTR_OPTIONS)
    whenPatternMismatch: string;

    @Attr(WHEN_ATTR_OPTIONS)
    whenRangeOverflow: string;

    @Attr(WHEN_ATTR_OPTIONS)
    whenRangeUnderflow: string;

    @Attr(WHEN_ATTR_OPTIONS)
    whenStepMismatch: string;

    @Attr(WHEN_ATTR_OPTIONS)
    whenTooLong: string;

    @Attr(WHEN_ATTR_OPTIONS)
    whenTypeMismatch: string;

    @Attr(WHEN_ATTR_OPTIONS)
    whenValueMissing: string;

    @Attr(WHEN_ATTR_OPTIONS)
    whenValid: string;

    @Attr(WHEN_ATTR_OPTIONS)
    error: string;

    @Attr({ onRender: (control: ControlElement) => control.validate() })
    required: boolean;

    @Attr({ observe: false, render: false })
    valid: boolean;

    @Attr({ observe: false, render: false })
    warning: boolean;

    @Attr({ observe: false, render: false })
    invalid: boolean;

    @Attr({ observe: false, render: false })
    dirty: boolean;

    @Attr({ observe: false, render: false })
    touched: boolean;

    @Attr({ observe: false, render: false })
    prompt: string;

    validate() {

        if (!this.ready) {
            return;
        }

        let prompt: string;

        for (const key in this.validity) {
            const eachWhether = this.validity[key];
            if (key === 'customError') {
                continue;
            }
            const eachPrompt = this['when' + capitalize(key)];
            if (eachPrompt !== undefined) {
                if (eachWhether) {
                    prompt = eachPrompt;
                    break;
                } else {
                    prompt = '';
                }
            }
        }

        const error = this.error;

        if (error && !prompt) {
            this.assignee.setCustomValidity(prompt = error);
        } else {
            this.assignee.setCustomValidity('');
        }

        this.valid = this.validity.valid;
        this.invalid = !this.validity.valid;

        this.prompt = prompt ? prompt : null;
    }

    render() {
        (this as any).lightTemplate.render(this);
        (this as any).template.render(this.shadowRoot);
    }
}
